<script setup lang="ts">
import * as echarts from "echarts";
import { useThrottleFn } from "@vueuse/core";
const props = defineProps<{
  mapId: string;
  width?: string;
  height?: string;
  zoom?: number;
  type?: string;
  // day: number;
}>();
let chart: any = null;
let option: any = null;
var data = [
  { name: "双溪镇", value: 5 },
  { name: "仁首镇", value: 5 },
  { name: "宝峰镇", value: 31 },
  { name: "高湖镇", value: 19 },
  { name: "璪都镇", value: 12 },
  { name: "香田乡", value: 3 },
  { name: "水口乡", value: 10 },
  { name: "官庄镇", value: 101 },
  { name: "中源乡", value: 637 },
  { name: "雷公尖乡", value: 10 },
  { name: "三爪仑乡", value: 28 },
];
var geoCoordMap = {
  双溪镇: [115.3358, 28.8943],
  仁首镇: [115.482604, 28.872135],
  宝峰镇: [115.405458, 29.001389],
  高湖镇: [115.245001, 28.924679],
  璪都镇: [115.168564, 29.007291],
  香田乡: [115.399686, 28.813039],
  水口乡: [115.299912, 28.884317],
  官庄镇: [115.055576, 28.944523],
  中源乡: [114.990017, 28.858943],
  雷公尖乡: [115.383722, 28.881862],
  三爪仑乡: [115.226384, 29.054236],
};
var convertData = function (data) {
  var res: any = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      });
    }
  }
  return res;
};
onMounted(() => {
  createChart();
});
const createChart = () => {
  var chartDom = document.getElementById(props.mapId)!;
  chart = echarts.init(chartDom);
  // let data: number[] = props.rankData[0];
  option = {
    title: {
      text: "",
      subtext: "统计数据截止2022年3月",
      sublink: "",
      left: "center",
      textStyle: {
        color: "#fff",
      },
    },

    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (typeof params.value[2] == "undefined") {
          return params.name + " : " + params.value;
        } else {
          return params.name + " : " + params.value[2];
        }
      },
    },
    legend: {
      orient: "vertical",
      y: "bottom",
      x: "right",
      data: ["pm2.5"],
      textStyle: {
        color: "#fff",
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 500,
      left: "left",
      top: "bottom",
      text: ["高", "低"], // 文本，默认为数值文本
      calculable: true,
      seriesIndex: [1],
      inRange: {},
    },
    geo: {
      map: "靖安县",
      label: {
        emphasis: {
          show: false,
        },
      },
      roam: false, //禁止其放大缩小
      itemStyle: {
        normal: {
          areaColor: "#4c60ff",
          borderColor: "#002097",
        },
        emphasis: {
          areaColor: "#293fff",
        },
      },
    },
    series: [
      {
        name: "靖安民宿",
        type: "scatter",
        coordinateSystem: "geo",
        data: convertData(data),
        symbolSize: function (val) {
          return val[2] / 3;
        },
        label: {
          normal: {
            formatter: "{b}",
            position: "right",
            show: true,
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: "#ffeb7b",
          },
        },
      },

      /**
		,
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 6)),
            symbolSize: function (val) {
                return val[2] / 20;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ffd800',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,.3)'
                }
            },
            zlevel: 1
        }
		**/
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
  <div :id="mapId" :style="{ width: width, height: height }"></div>
</template>
<style scoped lang="scss"></style>
<style></style>
