<script setup lang="ts">
import * as echarts from "echarts";
import { useThrottleFn } from "@vueuse/core";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const props = defineProps<{
  nightingaleData: {
    name: string;
    count: number;
    value: number;
    code: string;
  }[];
  nightingaleId: string;
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
  var chartDom = document.getElementById(props.nightingaleId)!;
  chart = echarts.init(chartDom);
  // let data: number[] = props.rankData[0];
  option = {
    legend: {
      top: "bottom",
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "Nightingale Chart",
        type: "pie",
        radius: [25, 40],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 8,
        },
        data: props.nightingaleData,
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
  <div :id="nightingaleId" :style="{ width: width, height: height }"></div>
</template>
<style scoped lang="scss"></style>
<style></style>
