import ReactECharts from "echarts-for-react";
import { QueryResult } from "@/lib/types";

const Charts = ({ queryRst }: { queryRst: QueryResult }) => {
  const seriesArray = Array(Object.keys(queryRst[0]).length).fill({
    type: "line",
  });

  const options = {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: Object.keys(queryRst[0]),
      source: queryRst,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {},
    series: seriesArray,
  };

  return (
    <ReactECharts
      style={{ width: "100%", height: "100%" }}
      option={options}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default Charts;
