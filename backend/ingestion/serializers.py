from rest_framework import serializers
from .models import NormalizedEmissionData, AuditTrail

class NormalizedEmissionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedEmissionData
        fields = '__all__'

class AuditTrailSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = AuditTrail
        fields = ['id', 'user_email', 'action', 'previous_state', 'new_state', 'timestamp']