from django.db import models


class File(models.Model):
    file = models.FileField(upload_to="files")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
