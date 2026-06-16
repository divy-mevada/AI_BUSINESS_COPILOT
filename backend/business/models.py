from django.db import models
from django.conf import settings
# Create your models here.

class BusinessReport(models.Model):
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE
  )

  title = models.CharField(
    max_length = 255
  )

  csv_file = models.FileField(
    upload_to = "csv_files/"
  )

  analysis_result = models.JSONField(
    null = True,
    blank = True
  )

  created_at = models.DateTimeField(
    auto_now_add = True
  )

  updated_at = models.DateTimeField(
    auto_now = True
  )

  def __str__(self):
    return self.title