import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
import numpy as np
import os


def save_arrow_table(arrow_table, file_path):
    folder_path = os.path.dirname(file_path)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    with pa.OSFile(file_path, "wb") as f:
        writer = pa.RecordBatchFileWriter(f, arrow_table.schema)
        writer.write_table(arrow_table)
        writer.close()
    return file_path


def save_parquet_table(arrow_table, file_path):
    folder_path = os.path.dirname(file_path)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    pq.write_table(arrow_table, file_path)
    return file_path


class Conn:
    def __init__(self):
        self.con = duckdb.connect()
        self.con.execute("SET home_directory = 'media/duck';")
        self.con.execute("INSTALL httpfs;")
        self.con.execute("LOAD httpfs;")
        self.con.execute("SET enable_http_metadata_cache=true;")
        self.con.execute("SET enable_object_cache=true;")

    def simple_query(self, query):
        """
        Execute a simple query and save the result to media/temp/temp.arrow
        """
        try:
            arrow_table = self.con.execute(query).arrow()
            if arrow_table.num_rows == 0:
                return {"err": "No data to save"}
            arrow_path = save_arrow_table(arrow_table, "media/temp/temp.arrow")
            return {"file_link": arrow_path}
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
