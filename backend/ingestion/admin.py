from django.contrib import admin
from .models import Organization, NormalizedEmissionData, AuditTrail

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)

@admin.register(NormalizedEmissionData)
class NormalizedEmissionDataAdmin(admin.ModelAdmin):
    # Focuses on visibility into scope categories, anomalies, and review statuses
    list_display = (
        'id', 
        'organization', 
        'source_type', 
        'scope_category', 
        'activity_type', 
        'calculated_co2e_kg', 
        'status', 
        'is_suspicious'
    )
    list_filter = ('status', 'source_type', 'scope_category', 'is_suspicious', 'organization')
    search_fields = ('activity_type', 'anomaly_reason', 'organization__name')
    readonly_fields = ('created_at', 'updated_at', 'raw_payload_snapshot')
    
    # Organizes structural data patterns cleanly for the administrative view
    fieldsets = (
        ('Tenant Context', {
            'fields': ('organization', 'source_type', 'scope_category')
        }),
        ('Activity & Calculation Specs', {
            'fields': ('activity_type', ('start_date', 'end_date'), ('raw_quantity', 'raw_unit'), ('normalized_quantity', 'normalized_unit'), 'calculated_co2e_kg')
        }),
        ('Audit Lifecycle Workflow', {
            'fields': ('status', 'is_suspicious', 'anomaly_reason')
        }),
        ('Data Lineage Payload Reference', {
            'classes': ('collapse',),
            'fields': ('raw_payload_snapshot', 'created_at', 'updated_at'),
        }),
    )

@admin.register(AuditTrail)
class AuditTrailAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_record_id', 'user', 'action', 'timestamp')
    list_filter = ('action', 'timestamp')
    readonly_fields = ('record', 'user', 'action', 'previous_state', 'new_state', 'timestamp')

    def get_record_id(self, obj):
        return f"Record #{obj.record.id}"
    get_record_id.short_description = 'Target Record'