<script setup lang="ts">
import * as echarts from "echarts";
import { useThrottleFn } from "@vueuse/core";
const props = defineProps<{
  pieData: { name: string; count: number; value: number }[];
  pieId: string;
  width?: string;
  height?: string;
  zoom?: number;
  // day: number;
}>();
let chart: any = null;
let option: any = null;
onMounted(() => {
  createChart();
});
const createChart = () => {
  var chartDom = document.getElementById(props.pieId)!;
  chart = echarts.init(chartDom);
  // let data: number[] = props.rankData[0];
  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "left",
      textStyle:{
        color:'#fff'
      }
    },
    series: [
      {
        name: "类型",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "left",
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: "20",
        //     fontWeight: "bold",
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: props.pieData,
      },
    ],
  };
  option && chart.setOption(option);
  window.onresize = useThrottleFn(() => {
    if (chart) {
      //@ts-ignore
      chart.resize();
    }
  }, 50);
};
</script>
<template>
  <div :id="pieId" :style="{ width: width, height: height }"></div>
</template>
<style scoped lang="scss"></style>
<style></style>
