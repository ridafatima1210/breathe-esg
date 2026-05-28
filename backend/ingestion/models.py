from django.db import models
from django.contrib.auth.models import User

class Organization(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class NormalizedEmissionData(models.Model):
    SCOPE_CHOICES = [
        ('Scope 1', 'Scope 1: Direct Emissions'),
        ('Scope 2', 'Scope 2: Indirect Emissions'),
        ('Scope 3', 'Scope 3: Other Indirect Emissions'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved for Audit'),
        ('REJECTED', 'Rejected / Flagged'),
    ]

    SOURCE_TYPE_CHOICES = [
        ('SAP', 'SAP ERP Export'),
        ('UTILITY', 'Utility Portal CSV'),
        ('CONCUR', 'Corporate Travel API'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES)
    scope_category = models.CharField(max_length=10, choices=SCOPE_CHOICES)
    
    activity_type = models.CharField(max_length=255) # e.g., Diesel Fuel, Electricity, Hotel Stay
    start_date = models.DateField()
    end_date = models.DateField()
    
    raw_quantity = models.FloatField()
    raw_unit = models.CharField(max_length=50)
    
    normalized_quantity = models.FloatField() # Standardized values
    normalized_unit = models.CharField(max_length=50)
    
    calculated_co2e_kg = models.FloatField()
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    is_suspicious = models.BooleanField(default=False)
    anomaly_reason = models.TextField(blank=True, null=True)
    
    raw_payload_snapshot = models.JSONField() # Lineage preservation
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.organization.name} - {self.activity_type} ({self.calculated_co2e_kg} kg CO2e)"

class AuditTrail(models.Model):
    record = models.ForeignKey(NormalizedEmissionData, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255) # e.g., "Approved row", "Edited normalized quantity"
    previous_state = models.JSONField(null=True, blank=True)
    new_state = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)