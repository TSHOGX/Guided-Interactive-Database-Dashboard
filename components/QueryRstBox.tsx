interface QueryResult {
  [key: string]: any;
}

export default function QueryRstBox({ queryRst }: { queryRst: QueryResult[] }) {
  if (!Array.isArray(queryRst)) {
    return <div>Invalid data format!</div>;
  }

  const keys = Object.keys(queryRst[0]);

  return (
    <div className="flex min-h-4 flex-col items-center justify-between gap-6 border p-2 pb-3 dark:border-white">
      <div className=" text-lg">QueryRstBox</div>
      <div className=" w-full rounded-lg border border-dashed p-2 text-sm dark:border-white dark:bg-black">
        {/* {queryRst} */}
        <table>
          <thead>
            <tr className=" text-gray-700 dark:text-white">
              {keys.map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody className=" text-gray-500 dark:text-gray-400">
            {queryRst.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {keys.map((key, colIndex) => (
                  <td key={colIndex}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
