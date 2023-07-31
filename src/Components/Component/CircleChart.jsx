import ReactEcharts from "echarts-for-react";

export default function CircleChart({ Total, Cost }) {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b} : Rs.{c} ({d}%)",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "center",
          formatter: "{b}: RS.{c}",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: Cost, name: "Cost" },
          { value: Total - Cost, name: "Profit" },
        ],
        color: ["#E95D56", "#288F60"],
      },
    ],
  };
  return (
    <div>
      <ReactEcharts
        option={option}
        style={{ width: "300px", height: "300px" }}
      ></ReactEcharts>
    </div>
  );
}
