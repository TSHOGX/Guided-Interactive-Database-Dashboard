import os

from rest_framework import viewsets, permissions
from rest_framework.response import Response

from .models import File
from .serializers import FileSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.AllowAny]

    # custom destroy method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # delete the file from the file system
        file_name = os.path.basename(instance.file.path)
        file_path = "media/files/" + file_name
        os.remove(file_path)
        # delete the file from the database
        self.perform_destroy(instance)
        return Response("File successfully deleted!")
