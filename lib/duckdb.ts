import { DuckConn, getColValAsNumber } from "./useDuckConn";

export type TableField = { name: string; type: string };

export type TablesInfo = {
  inputFileName?: string;
  inputTableName?: string;
  inputTableFields?: TableField[];
  inputRowCount?: number;
};

export function makeTableName(inputFileName: string): string {
  return inputFileName.replace(/\.[^\.]*$/, "").replace(/\W/g, "_");
}

export async function getAllTableNames(duckConn: DuckConn) {
  const res = await duckConn.conn.query(`SHOW ALL TABLES`);
  const tableNames = Array.from(res).map((row) => ({
    name: String(row?.name),
  }));
  return tableNames;
}

export async function createTableFromFile(file: File, duckConn: DuckConn) {
  const inputFileName = file.name;
  await duckConn.db.dropFile(inputFileName);
  await duckConn.db.registerFileHandle(inputFileName, file, 2, true); // last two paras???

  const inputTableName = makeTableName(inputFileName);

  await duckConn.conn.query(`
       CREATE OR REPLACE TABLE ${inputTableName} AS SELECT * FROM '${inputFileName}'
    `);

  return inputTableName;
}
