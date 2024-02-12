from rest_framework.response import Response
from rest_framework.decorators import api_view
import re

from .functions.duckcon import Conn


duckcon = Conn()


@api_view(["POST"])
def simple_query(request):
    query = request.data.get("query")
    # save query result to arrow file
    if query.startswith("-- save"):
        result = duckcon.create_table_query(query)
    else:
        result = duckcon.simple_query(query)
    print(result)
    return Response(result)


@api_view(["GET"])
def get_table_list(request):
    result = duckcon.get_table_list()
    return Response(result)
