from django.db import models


class Table(models.Model):
    table = models.FileField(upload_to="tables")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
