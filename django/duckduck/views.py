import os
from django.http import FileResponse

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Table
from .serializers import TableSerializer
from .functions.duckcon import Conn
from .functions.llm import LLMConnector

import pyarrow as pa


duckcon = Conn()
llm = LLMConnector()


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.AllowAny]


def save_arrow_table(arrow_table, file_path):
    folder_path = os.path.dirname(file_path)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    with pa.OSFile(file_path, "wb") as f:
        writer = pa.RecordBatchFileWriter(f, arrow_table.schema)
        writer.write_table(arrow_table)
        writer.close()
    return file_path


@api_view(["POST"])
def excute_query(request):
    """
    {"query": "show tables"}
    {"err": "..."} / FileResponse
    {"llm": "..."}
    """
    query = request.data.get("query")
    if query.startswith("-- llm: "):
        llm_result = llm.run(query[8:])
        # llm_result = "it idsadss a test"
        if llm_result:
            result = {"llm": llm_result}
        else:
            result = {"err": "LLM error"}
    else:
        result = duckcon.simple_query(query)

    print(result)

    if "file_link" in result:
        return FileResponse(open(result["file_link"], "rb"))
    elif "err" in result and result["err"] == "No data to save":
        return FileResponse(open("media/temp/error0.arrow", "rb"))
    elif "err" in result:
        error_table = pa.Table.from_pydict({"err": [result["err"]]})
        arrow_path = save_arrow_table(error_table, "media/temp/error.arrow")
        return FileResponse(open(arrow_path, "rb"))
    elif "llm" in result:
        llm_table = pa.Table.from_pydict({"llm": [result["llm"]]})
        arrow_path = save_arrow_table(llm_table, "media/temp/llm.arrow")
        return FileResponse(open(arrow_path, "rb"))

    return Response(result, status=400)


@api_view(["GET"])
def get_table_list(request):
    """
    {"status": "ok", "table_list": ["table1", "table2", ...]}
    """
    result = duckcon.get_table_list()
    return Response(result)
