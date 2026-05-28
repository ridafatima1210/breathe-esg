import json
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import NormalizedEmissionData, Organization, AuditTrail
from .serializers import NormalizedEmissionDataSerializer, AuditTrailSerializer

class DataIngestionView(APIView):
    def post(self, request):
        org_id = request.data.get('organization_id')
        source_type = request.data.get('source_type')
        payload = request.data.get('payload', [])
        
        try:
            org = Organization.objects.get(id=org_id)
        except Organization.DoesNotExist:
            return Response({"error": "Invalid Organization ID"}, status=status.HTTP_400_BAD_REQUEST)

        records_created = 0
        
        for item in payload:
            try:
                if source_type == 'SAP':
                    # Parse realistic flat SAP file context headers: LITER (Liters), MATNR, WERKS
                    raw_qty = float(item.get('MENGE', 0))
                    raw_unit = item.get('MEINS', 'L')
                    activity = f"SAP Fuel/Procurement - Material: {item.get('MATNR', 'Unknown')}"
                    
                    # Normalization rules logic
                    norm_qty = raw_qty
                    if raw_unit.upper() in ['L', 'LITER', 'LITRES']:
                        norm_unit = 'Liters'
                    else:
                        norm_unit = raw_unit
                    
                    # Dummy conversion factor calculation
                    co2e = norm_qty * 2.68 # Baseline diesel conversion scale
                    scope = 'Scope 1'
                    suspicious = norm_qty > 50000 
                    reason = "High volume transaction alert" if suspicious else ""

                elif source_type == 'UTILITY':
                    # Reality: Billing periods don't match calendar months
                    raw_qty = float(item.get('Usage_kWh', 0))
                    raw_unit = 'kWh'
                    activity = f"Grid Electricity - Meter: {item.get('Meter_ID', 'Unknown')}"
                    norm_qty = raw_qty
                    norm_unit = 'kWh'
                    co2e = norm_qty * 0.42 # Avg grid emission intensity factor
                    scope = 'Scope 2'
                    suspicious = "2025" not in item.get('Bill_Period_End', '')
                    reason = "Out-of-period billing dates flagged" if suspicious else ""

                elif source_type == 'CONCUR':
                    # Travel endpoint using airport codes instead of numeric distance
                    origin = item.get('OriginAirport', '')
                    dest = item.get('DestAirport', '')
                    activity = f"Flight: {origin} to {dest}"
                    raw_qty = 1.0
                    raw_unit = 'Trip'
                    norm_qty = 1200.0 # Estimated nautical miles conversion proxy
                    norm_unit = 'Miles'
                    co2e = norm_qty * 0.15
                    scope = 'Scope 3'
                    suspicious = origin == dest
                    reason = "Identical origin and destination codes detected" if suspicious else ""
                else:
                    continue

                NormalizedEmissionData.objects.create(
                    organization=org,
                    source_type=source_type,
                    scope_category=scope,
                    activity_type=activity,
                    start_date=item.get('Start_Date', '2026-01-01'),
                    end_date=item.get('End_Date', '2026-01-31'),
                    raw_quantity=raw_qty,
                    raw_unit=raw_unit,
                    normalized_quantity=norm_qty,
                    normalized_unit=norm_unit,
                    calculated_co2e_kg=co2e,
                    is_suspicious=suspicious,
                    anomaly_reason=reason,
                    raw_payload_snapshot=item
                )
                records_created += 1
            except Exception as e:
                return Response({"error": f"Failed to process element row: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response({"message": f"Successfully ingested {records_created} records."}, status=status.HTTP_201_CREATED)

class EmissionDataListView(generics.ListAPIView):
    queryset = NormalizedEmissionData.objects.all().order_by('-is_suspicious', '-created_at')
    serializer_class = NormalizedEmissionDataSerializer

class RowActionView(APIView):
    def post(self, request, pk):
        try:
            record = NormalizedEmissionData.objects.get(pk=pk)
        except NormalizedEmissionData.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        target_status = request.data.get('status')
        if target_status not in ['APPROVED', 'REJECTED']:
            return Response({"error": "Invalid workflow status change execution type"}, status=status.HTTP_400_BAD_REQUEST)
        
        old_state = {"status": record.status}
        record.status = target_status
        record.save()
        
        AuditTrail.objects.create(
            record=record,
            user=request.user if request.user.is_authenticated else None,
            action=f"Status update completed directly to: {target_status}",
            previous_state=old_state,
            new_state={"status": target_status}
        )
        
        return Response({"message": f"Record updated successfully to status {target_status}"})