<script setup lang="ts">
import * as echarts from "echarts";
import { useThrottleFn } from "@vueuse/core";
const props = defineProps<{
  categoryData: string[];
  seriesData: number[];
  categoryId: string;
  width?: string;
  height?: string;
  zoom?: number;
  type?: string;
  // day: number;
}>();
let chart: any = null;
let option: any = null;
onMounted(() => {
  createChart();
});
const createChart = () => {
  var chartDom = document.getElementById(props.categoryId)!;
  chart = echarts.init(chartDom);
  // let data: number[] = props.rankData[0];
  let arr: any = props.type
    ? [
        {
          type: "category",
          data: props.categoryData,
        },
        {
          type: "value",
        },
      ]
    : [
        {
          type: "value",
        },
        {
          type: "category",
          data: props.categoryData,
        },
      ];
  option = {
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      ...arr[0],
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      ...arr[1],
      axisLabel: {
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    series: [
      {
        data: props.seriesData,
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: props.type ? 0 : 1,
            y2: props.type ? 1 : 0,
            colorStops: [
              {
                offset: 0,
                color: props.type ?"#053CFB":"#05E7FB", // 0% 处的颜色
              },
              {
                offset: 1,
                color: props.type ?"#05E7FB":"#053CFB", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
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
  <div :id="categoryId" :style="{ width: width, height: height }"></div>
</template>
<style scoped lang="scss"></style>
<style></style>
