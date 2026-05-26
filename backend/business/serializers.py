from rest_framework import serializers
from .models import BusinessReport

class BusinessReportSerializer(
  serializers.ModelSerializer
):
  class Meta:
    model = BusinessReport
    
    fields = "__all__"

    