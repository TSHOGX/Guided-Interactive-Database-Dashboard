import re
import duckdb
import pyarrow as pa
import numpy as np


def save_arrow_table(arrow_table, file_path):
    with pa.OSFile(file_path, "wb") as f:
        writer = pa.RecordBatchFileWriter(f, arrow_table.schema)
        writer.write_table(arrow_table)
        writer.close()
    return file_path


class Conn:
    def __init__(self):
        self.con = duckdb.connect()
        # self.con.execute("SET home_directory = 'media/files';")
        self.con.execute("INSTALL httpfs;")
        self.con.execute("LOAD httpfs;")
        self.con.execute("SET enable_http_metadata_cache=true;")
        self.con.execute("SET enable_object_cache=true;")

    def simple_query(self, query):
        """
        Execute a simple query and save the result to media/temp/simple_query_table.arrow
        """
        # arrow_table = self.con.execute(query).fetch_arrow_table()
        try:
            arrow_table = self.con.execute(query).arrow()
            return {
                "status": "ok",
                "link": save_arrow_table(
                    arrow_table, "media/temp/simple_query_table.arrow"
                ),
            }
        except Exception as e:
            return {"err": str(e)}

    def create_table_query(self, query):
        """
        Match "-- save <table_name>" and save the result to an arrow file in media/tables/
        TODO: show in frontend; click to download / delete like uploaded files
        """
        match = re.match(r"--\s*save\s+(\w+)", query)
        try:
            arrow_table = self.con.execute(query).arrow()
            if match:
                table_name = match.group(1)
                return {
                    "status": "ok",
                    "link": save_arrow_table(
                        arrow_table, f"media/tables/{table_name}.arrow"
                    ),
                }
            else:
                return {"err": "Table name not found"}
        except Exception as e:
            return {"err": str(e)}

    def get_table_list(self):
        """
        Get a list of all tables in duckdb [..., "table_name", ...]
        """
        table_list = []
        arr = np.array(self.con.execute("SHOW TABLES;").fetchnumpy())
        table_list = arr.squeeze().tolist()
        return {"status": "ok", "table_list": table_list}

    # def data_ingestion(self, file_path):
    #     if file_path.endswith(".csv"):
    #         self.con.read_csv(file_path)
    #     elif file_path.endswith(".parquet"):
    #         self.con.read_parquet(file_path)
    #     elif file_path.endswith(".json"):
    #         self.con.read_json(file_path)
    #     else:
    #         raise Exception("Unsupported file type")

    # def make_table_from_file(self, file_path, tbl_name):
    #     self.simple_query(
    #         f"CREATE OR REPLACE TABLE {tbl_name} AS SELECT * FROM '{file_path}'"
    #     )
