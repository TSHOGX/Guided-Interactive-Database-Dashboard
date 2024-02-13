from django.http import FileResponse

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Table
from .serializers import TableSerializer
from .functions.duckcon import Conn


duckcon = Conn()


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["POST"])
def excute_query(request):
    """
    {"query": "show tables"}
    {"err": "..."} / FileResponse
    """
    query = request.data.get("query")
    result = duckcon.simple_query(query)
    if "file_link" in result:
        return FileResponse(open(result["file_link"], "rb"))
    return Response(result)


@api_view(["GET"])
def get_table_list(request):
    """
    {"status": "ok", "table_list": ["table1", "table2", ...]}
    """
    result = duckcon.get_table_list()
    return Response(result)
