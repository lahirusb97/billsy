import ReactEcharts from "echarts-for-react";
const option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["Total", "Cost"],
  },
  xAxis: [
    {
      type: "category",
      data: [
        "Jun",
        "Fed",
        "Mar",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "Cost",
      min: 1000,
      max: 500000,
      interval: 50000,
      axisLabel: {
        formatter: "{value} Rs",
      },
    },
    {
      type: "value",
      name: "Temperature",
      min: 1000,
      max: 50000,
      interval: 50000,
      axisLabel: {
        formatter: "{value} Rs",
      },
    },
  ],
  series: [
    {
      name: "Total",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " Rs";
        },
      },
      data: [
        100000, 86000, 31000, 50300, 69000, 250000, 36000, 162000, 32000, 20000,
        64000, 33000,
      ],
    },
    {
      name: "Cost",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " Rs";
        },
      },
      data: [
        56000, 60000, 15000, 45000, 36000, 150000, 17500, 122000, 12000, 10000,
        40000, 15300,
      ],
    },
  ],
};
export default function TotalChart() {
  return (
    <div>
      <ReactEcharts
        option={option}
        style={{ width: "90vw", height: "50vh" }}
      ></ReactEcharts>
    </div>
  );
}
