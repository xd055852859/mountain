<script setup lang="ts">
import { ElMessage } from "element-plus";
import AMapLoader from "@amap/amap-jsapi-loader";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import homePng from "@/assets/img/home.png";
const { setLocation } = appStore.commonStore;
const { deviceType } = storeToRefs(appStore.commonStore);
const { domain } = storeToRefs(appStore.authStore);

const props = defineProps<{
  mapId: string;
  width: string;
  height: string;
  pointArray?: any;
  pointCode?: any;
  type?: string;
  hasWeather?: boolean;
}>();
const emits = defineEmits<{
  (e: "setName", name: string, address: any): void;
  (e: "searchEvent", lng: number, lat: number): void;
}>();
const amap = shallowRef<any>(null);
const amapData = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const polygon = shallowRef<any>(null);
const cluster = shallowRef<any>(null);
onMounted(() => {
  if (props.type !== "screen") {
    initMap();
  }
});
// onUnmounted(() => {
//   if (amap.value) {
//     amap.value.clearEvents("click");
//     if (marker.value) {
//       amap.value.remove(marker.value);
//       marker.value = null;
//     }
//     if (cluster.value) {
//       cluster.value.setMap(null);
//       cluster.value = null;
//     }
//     if (polygon.value) {
//       amap.value.remove(polygon.value);
//       polygon.value = null;
//     }
//     amapData.value = null;
//     amap.value.destroy();
//     amap.value = null;
//     console.log(polygon.value);
//   }
// });
const initPath = () => {
  if (polygon.value) {
    amap.value.remove(polygon.value);
  }
  let adCode = domain.value?.regionCode.substring(0, 6);
  amap.value.plugin("AMap.DistrictSearch", function () {
    new amapData.value.DistrictSearch({
      extensions: "all",
      subdistrict: 0,
    }).search(adCode, function (status, result) {
      // 外多边形坐标数组和内多边形坐标数组
      // const canvas = document.createElement("canvas");
      // const ctx: any = canvas.getContext("2d");
      // // 将 canvas 宽高设置为地图实例的宽高
      // canvas.width = amap.value.getSize().width;
      // canvas.height = amap.value.getSize().height;
      // const image = new Image();
      // image.src = homePng;
      // image.onload = function (event) {
      //   ctx.drawImage(
      //     image,
      //     0,
      //     0,
      //     amap.value.getSize().width,
      //     amap.value.getSize().height
      //   );
      //   // 创建一个自定义图层
      //   var customLayer = new amapData.value.CustomLayer(canvas, {
      //     zIndex: 12,
      //   });
      var outer = [
        new amapData.value.LngLat(-360, 90, true),
        new amapData.value.LngLat(-360, -90, true),
        new amapData.value.LngLat(360, -90, true),
        new amapData.value.LngLat(360, 90, true),
      ];
      var holes = result.districtList[0].boundaries;
      var pathArray = [outer];
      pathArray.push.apply(pathArray, holes);
      polygon.value = new amapData.value.Polygon({
        pathL: pathArray,
        strokeColor: props.type === "screen" ? "#0a0a6c" : "#a0cfff", //城市边界颜色
        strokeWeight: 2,
        fillColor: props.type === "screen" ? "#0a0a6c" : "#a0cfff", // 遮罩背景色黑色
        fillOpacity: 1,
      });
      polygon.value.setPath(pathArray);
      // amap.value.add(customLayer);
      amap.value.add(polygon.value);
      // };
    });
  });
};
const initMap = () => {
  console.log(props.mapId);
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.Geocoder",
      "AMap.DistrictSearch",
      "AMap.MarkerClusterer",
      "AMap.Weather",
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      amap.value = new AMap.Map(props.mapId, {
        //设置地图容器id
        viewMode: "3D", //是否为3D地图模式
        zoom: 5, //初始化地图级别
        //初始化地图中心点位置
        // resizeEnable: true,
        center: [0, 0],
      });
      // ,
      // console.log(map.value);
      amapData.value = AMap;
      let adCode = domain.value?.regionCode.substring(0, 6);
      if (adCode) {
        amap.value.setCity(adCode, () => {
          //@ts-ignore
          amap.value.setZoom(domain.value.level + domain.value.level * 0.5 + 5);
        });
        initPath();
        if (props.hasWeather) {
          getWeather(adCode);
        }
        if (props.pointArray) {
          setCluster(props.pointArray);
        }
        if (props.type === "screen" && props.pointCode) {
          getCluster(props.pointCode);
        } else {
          amap.value.on("click", clickMap);
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
const getWeather = (adCode: string) => {
  amap.value.plugin("AMap.Weather", function () {
    //创建天气查询实例
    var weather = new amapData.value.Weather();

    //执行实时天气信息查询
    weather.getLive(adCode, function (err, data) {
      console.log(err, data);
    });
  });
};
const setPointer = (lng, lat) => {
  setLocation(lng, lat);
  if (marker.value) {
    amap.value.remove(marker.value);
  }
  marker.value = new amapData.value.Marker({
    position: new amapData.value.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    label: "当前",
  });
  amap.value.add(marker.value);
  let adCode = domain.value?.regionCode.substring(0, 6);
  amap.value.plugin("AMap.Geocoder", function () {
    var geocoder = new amapData.value.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: adCode,
    });
    geocoder.getAddress([lng, lat], function (status, result) {
      if (status === "complete" && result.info === "OK") {
        // result为对应的地理位置详细信息
        emits(
          "setName",
          result.regeocode.formattedAddress,
          result.regeocode.addressComponent
        );
        // marker.value.set(result.regeocode.formattedAddress);
      }
    });
  });
};
const setCluster = (pointArray) => {
  if (cluster.value) {
    cluster.value.setMap(null);
  }
  amap.value.plugin("AMap.MarkerClusterer", function () {
    cluster.value = new amapData.value.MarkerCluster(amap.value, pointArray);
    cluster.value.on("click", clickCluster);
  });
};
const getCluster = (code) => {
  let adCode = domain.value?.regionCode.substring(0, 6);
  amap.value.plugin("AMap.Geocoder", function () {
    var geocoder = new amapData.value.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: adCode,
    });
    let arr: any = [];
    props.pointCode.forEach((item, index) => {
      geocoder.getLocation(item.fullAreaName, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          // result中对应详细地理坐标信息
          let lng = result.geocodes[0].location.lng;
          let lat = result.geocodes[0].location.lat;
          if (lng && lat) {
            console.log(lng, lat);
            arr.push({
              lnglat: [lng, lat],
            });
            if (index === code.length - 1) {
              console.log(arr);
              setCluster(arr);
            }
          }
        }
      });
    });
  });
};
const clickMap = (e) => {
  if (e.lnglat.lng && e.lnglat.lat) {
    setPointer(e.lnglat.lng, e.lnglat.lat);
  }
};
const clickCluster = (e) => {
  // e.stopPropagation();
  console.log(e);
  console.log(parseInt(amap.value.getZoom()));
  console.log(e.lnglat.lng, e.lnglat.lat);
  if (e.clusterData.length === 1) {
    console.log(e.clusterData);
  } else {
    amap.value.setZoom(amap.value.getZoom() + 1);
    amap.value.setCenter([e.lnglat.lng, e.lnglat.lat]);
  }
};
const clearMap = (e) => {
  amap.value.remove(marker.value);
};
watch(
  () => props.pointCode,
  (newVal) => {
    if (newVal.length > 0) {
      if (cluster.value) {
        cluster.value.setMap(null);
      }
      initMap();
    }
  }
);
watch(
  () => props.pointArray,
  (newVal) => {
    if (newVal.length > 0) {
      if (cluster.value) {
        cluster.value.setMap(null);
      }
      initMap();
    }
  }
);
defineExpose({
  setCluster,
});
</script>
<template>
  <div
    :id="props.mapId"
    :style="{ width: width, height: height }"
    class="common-map"
  ></div>
</template>
<style scoped lang="scss"></style>
<style lang="scss">
.common-map {
  padding-right: 1px;
  .amap-layer {
    width: calc(100% + 1px) !important;
  }
}
</style>
