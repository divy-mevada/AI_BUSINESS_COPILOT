from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import BusinessReport
import requests
# Create your views here.

class UploadCSVView(APIView):
  def post(self,request):
    csv_file = request.FILES.get(
      "file"
    )

    if not csv_file:
      return Response(
        {
          "error" : "No file upload"
        },
        status = 400
      )

    file_bytes = csv_file.read()

    fastapi_url = (
      "http://127.0.0.1:8001/upload-csv/"
    )
    files = {
      "file": (
        csv_file.name,
        file_bytes,
        "text/csv"
      )
    }
    try:
      response = requests.post(
        fastapi_url,
        files=files,
        timeout=120
      )
    except requests.RequestException as exc:
      return Response(
        {
          "error": "AI service is unreachable",
          "details": str(exc)
        },
        status=status.HTTP_502_BAD_GATEWAY
      )

    if response.status_code == 200:

      analysis_data = response.json()

      if request.user.is_authenticated:
        csv_file.seek(0)
        report = BusinessReport.objects.create(
          user=request.user,
          title=csv_file.name,
          csv_file=csv_file,
          analysis_result=analysis_data
        )

      return Response(
        analysis_data
      )

    upstream_error = None

    try:
      upstream_error = response.json()
    except ValueError:
      upstream_error = response.text

    return Response(
      {
        "error": "AI service failed",
        "status_code": response.status_code,
        "details": upstream_error
      },
      status=status.HTTP_502_BAD_GATEWAY
    )
