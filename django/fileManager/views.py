import os
import pyarrow as pa
import numpy as np

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import File
from .serializers import FileSerializer


# GET /file-manager/files-router/ - list all files
class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["DELETE"])
def delete_file(request, pk):
    # delete the file from the database
    file = File.objects.get(id=pk)
    file.delete()
    # delete the file from the file system
    file_name = os.path.basename(file.file.path)
    file_path = "media/files/" + file_name
    os.remove(file_path)
    return Response("File successfully deleted!")
