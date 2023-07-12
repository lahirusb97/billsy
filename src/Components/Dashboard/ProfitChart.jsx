import ReactEcharts from "echarts-for-react";
const option = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
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
        formatter: "{b}: {c}",
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
        { value: 1000, name: "Total" },
        { value: 250, name: "Const" },
        { value: 750, name: "Profit" },
      ],
      // color: ["#ff0000", "#00ff00", "#0000ff"],
    },
  ],
};
export default function ProfitChart() {
  return (
    <div>
      <ReactEcharts
        option={option}
        style={{ width: "300px", height: "300px" }}
      ></ReactEcharts>
    </div>
  );
}
