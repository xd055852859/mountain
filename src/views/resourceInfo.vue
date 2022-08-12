<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import AMapLoader from "@amap/amap-jsapi-loader";
import api from "@/services/api";
import appStore from "@/store";
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ResourceInfo } from "@/interface/Resource";
const { domain, user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const route = useRoute();
const dayjs: any = inject("dayjs");
const resourceKey = ref<string>("");
const resourceInfo = ref<ResourceInfo | null>(null);
const tabType = ref<number>(1);
const activeName = ref<string>("1");
const hospitalArray = ref<any>([]);
const schoolArray = ref<any>([]);
const parkArray = ref<any>([]);
const hotelArray = ref<any>([]);

onMounted(() => {
  //   // searchNearBy(map.value.getCenter(), adCode);
});
const getLocation = (cityName) => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    let adCode = domain.value?.regionCode.substring(0, 6);
    AMap.plugin("AMap.Geocoder", function () {
      var geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: adCode,
      });

      geocoder.getLocation(cityName, function (status, locationResult) {
        if (status === "complete" && locationResult.info === "OK") {
          // result中对应详细地理坐标信息
          AMap.plugin(["AMap.PlaceSearch"], function () {
            let placeSearch = new AMap.PlaceSearch({
              pageSize: 50, // 每页10条
              pageIndex: 1, // 获取第一页
              // 指定城市名(如果你获取不到城市名称，这个参数也可以不传，注释掉)
            });
            // 第一个参数是关键字，这里传入的空表示不需要根据关键字过滤
            // 第二个参数是经纬度，数组类型
            // 第三个参数是半径，周边的范围
            // 第四个参数为回调函数
            getNear("医院", placeSearch, locationResult);
            getNear("学校", placeSearch, locationResult);
            getNear("公园", placeSearch, locationResult);
            getNear("酒店", placeSearch, locationResult);
          });
        }
      });
    });
  });
};
const getNear = (type, placeSearch, locationResult) => {
  placeSearch.searchNearBy(
    type,
    [
      locationResult.geocodes[0].location.lng,
      locationResult.geocodes[0].location.lat,
    ],
    2000,
    function (status, result) {
      if (result.info === "OK") {
        let locationList = result.poiList.pois; // 周边地标建筑列表
        console.log(locationList);
        switch (type) {
          case "医院":
            hospitalArray.value = locationList;
            break;
          case "学校":
            schoolArray.value = locationList;
            break;
          case "公园":
            parkArray.value = locationList;
            break;
          case "酒店":
            hotelArray.value = locationList;
            break;
        }
        //type
        //医疗保健服务;综合医院;综合医院  医院
        //风景名胜;公园广场;公园
        //住宿服务;宾馆酒店;宾馆酒店
        //科教文化服务;学校;成人教育
      } else {
        console.log("获取位置信息失败!");
      }
    }
  );
};
const getResourceInfo = async () => {
  tabType.value =
    +route.params.tabType || +(localStorage.getItem("tabType") as string);
  resourceKey.value =
    (route.params.resourceKey as string) ||
    (localStorage.getItem("resourceKey") as string);
  localStorage.setItem("tabType", tabType.value + "");
  localStorage.setItem("resourceKey", resourceKey.value + "");
  let url = "";
  let obj: any = {};
  if (tabType.value === 3) {
    url = "labour/detail";
    obj.labourKey = resourceKey.value;
  } else {
    url = "resource/detail";
    obj.resourceKey = resourceKey.value;
  }
  const resourceRes = (await api.request.get(url, {
    ...obj,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    resourceInfo.value = { ...resourceRes.data };
    let regionName = "";
    if (resourceInfo.value) {
      console.log(resourceInfo.value.regionArr);
      resourceInfo.value.regionArr.forEach((item) => {
        regionName += item.name;
      });
    }
    getLocation(regionName);
  }
};

watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getResourceInfo();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>{{ resourceInfo?.name }}</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="resourceInfo"
    :style="
      deviceType === 'computer'
        ? {
            marginTop: '50px',
            height: `calc(100vh - 50px)`,
          }
        : { height: `calc(100vh - 60px)` }
    "
  >
    <template v-if="resourceInfo">
      <div class="resourceInfo-img">
        <el-carousel trigger="click" height="35vh">
          <el-carousel-item v-for="item in resourceInfo.imageList" :key="item">
            <div class="resourceInfo-img-item"><img :src="item" alt="" /></div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div
        class="resourceInfo-nav"
        :style="
          deviceType === 'phone'
            ? { width: '100%' }
            : { width: '85vw', minWidth: '650px' }
        "
      >
        <el-tabs v-model="activeName" class="demo-tabs">
          <template v-if="tabType !== 3">
            <el-tab-pane label="基础信息" name="1">
              <div class="resourceInfo-nav-item">
                <div>
                  <span>交易价 :</span>
                  {{
                    resourceInfo?.rentOfYear && resourceInfo.rentOfYear >= 10000
                      ? (resourceInfo.rentOfYear / 10000).toFixed(2) + "万元"
                      : resourceInfo.rentOfYear + "元"
                  }}
                </div>
                <div>
                  <span>托管期限 : </span>{{ resourceInfo.depositTime }}
                </div>
                <div><span>结算方式 : </span>{{ resourceInfo.sMethod }}</div>
                <template v-if="resourceInfo.regionArr">
                  <div>
                    <span>所在乡镇 : </span
                    >{{
                      resourceInfo.regionArr[
                        resourceInfo.regionArr.length - 2
                      ] &&
                      resourceInfo.regionArr[resourceInfo.regionArr.length - 2]
                        .name
                    }}
                  </div>
                  <div>
                    <span>所在村 : </span
                    >{{
                      resourceInfo.regionArr[
                        resourceInfo.regionArr.length - 1
                      ] &&
                      resourceInfo.regionArr[resourceInfo.regionArr.length - 1]
                        .name
                    }}
                  </div>
                </template>
                <div>
                  <span>闲置 : </span>{{ resourceInfo.unused ? "是" : "否" }}
                </div>
                <div>
                  <span>资源面积 : {{ resourceInfo.area }}</span>
                  {{ resourceInfo.tagInfo.unit }}
                </div>
                <div><span>类别 : </span>{{ resourceInfo.depositTime }}</div>
                <div><span>资源星级 : </span>{{ resourceInfo.star }}</div>
                <div>
                  <span>联系人 : </span
                  >{{ resourceInfo?.contactsInfo?.userName }}
                </div>
                <div>
                  <span>联系电话 :</span>
                  {{ resourceInfo?.contactsInfo?.mobile }}
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="报价信息" name="2" v-if="tabType === 2">
              <div class="resourceInfo-nav-item">
                <div>
                  <span>当前状态 :</span>
                  {{
                    dayjs(resourceInfo.offerEndTime).valueOf() >
                    dayjs().valueOf()
                      ? "报价中"
                      : "已结束"
                  }}
                </div>
                <div><span>已报价人员 : </span>{{ resourceInfo.offerNum }}</div>
                <div><span>起价 : </span>{{ resourceInfo.offer }}</div>
                <div>
                  <span>开始时间 :</span>
                  {{ dayjs(resourceInfo.offerBegTime).format("YYYY-M-D") }}
                </div>
                <div>
                  <span>报价截止时间 :</span>
                  {{ dayjs(resourceInfo.offerEndTime).format("YYYY-M-D") }}
                </div>
                <div>
                  <span>项目描述 :</span>
                  <div>{{ resourceInfo.describe }}</div>
                </div>
              </div>
            </el-tab-pane>
            //
            <el-tab-pane label="生态环境" name="3">
              //
              <div class="resourceInfo-nav-item">
                //
                <div>// <span>空气质量 : </span> //</div>
                //
                <div>// <span>农业用地 : </span> //</div>
                //
                <div>// <span>森林覆盖率 : </span> //</div>
                //
                <div>// <span>荣誉证书 : </span> //</div>
                //
              </div></el-tab-pane
            >
            <el-tab-pane label="配套服务" name="4">
              <div class="resourceInfo-nav-item">
                <template v-if="hospitalArray.length > 0">
                  <div class="resourceInfo-nav-title">周边医院</div>
                  <div
                    v-for="(item, index) in hospitalArray"
                    :key="'hospital' + index"
                    class="resourceInfo-nav-location"
                  >
                    <div>{{ item.name }}</div>
                    <div>{{ item.distance }} 米</div>
                  </div>
                </template>
                <template v-if="schoolArray.length > 0">
                  <div class="resourceInfo-nav-title">周边学校</div>
                  <div
                    v-for="(item, index) in schoolArray"
                    :key="'school' + index"
                    class="resourceInfo-nav-location"
                  >
                    <div>{{ item.name }}</div>
                    <div>{{ item.distance }} 米</div>
                  </div>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane label="产业聚集" name="5"
              ><div class="resourceInfo-nav-item">
                <template v-if="hospitalArray.length > 0">
                  <div class="resourceInfo-nav-title">周边公园</div>
                  <div
                    v-for="(item, index) in parkArray"
                    :key="'park' + index"
                    class="resourceInfo-nav-location"
                  >
                    <div>{{ item.name }}</div>
                    <div>{{ item.distance }} 米</div>
                  </div>
                </template>
                <template v-if="hotelArray.length > 0">
                  <div class="resourceInfo-nav-title">周边酒店</div>
                  <div
                    v-for="(item, index) in hotelArray"
                    :key="'hotal' + index"
                    class="resourceInfo-nav-location"
                  >
                    <div>{{ item.name }}</div>
                    <div>{{ item.distance }} 米</div>
                  </div>
                </template>
              </div></el-tab-pane
            >
          </template>
          <el-tab-pane label="标的" name="1" v-else>
            <div class="resourceInfo-nav-item">
              <div>
                <span>当前状态 :</span>
                {{
                  dayjs(resourceInfo.offerEndTime).valueOf() > dayjs().valueOf()
                    ? "报价中"
                    : "已结束"
                }}
              </div>
              <div><span>类型 : </span>{{ resourceInfo.tagInfo.name }}</div>
              <div><span>已报价单位 : </span>{{ resourceInfo.offerNum }}</div>
              <div>
                <span>开始时间 :</span>
                {{ dayjs(resourceInfo.offerBegTime).format("YYYY-M-D") }}
              </div>
              <div>
                <span>报价截止时间 :</span>
                {{ dayjs(resourceInfo.offerEndTime).format("YYYY-M-D") }}
              </div>
              <div>
                <span>项目描述 :</span>
                <div>{{ resourceInfo.describe }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <div class="resourceInfo-button">
      <el-button
        type="success"
        :style="
          deviceType === 'phone'
            ? { width: '100%', height: '40px' }
            : { width: '350px', height: '40px' }
        "
        @click="$router.push('resourceReport')"
        v-if="user"
        >{{ resourceInfo?.allowOffer ? "我要咨询" : "我有意向" }}</el-button
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.resourceInfo {
  width: 100%;
  box-sizing: border-box;
  @include flex(center, null, wrap);
  @include scroll();
  .resourceInfo-img {
    width: 100%;
    height: 35vh;
    @include p-number(15px);
    .resourceInfo-img-item {
      width: calc(100vw - 30px);
      height: 35vh;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .resourceInfo-nav {
    margin-bottom: 10px;
    @include p-number(15px);
    .resourceInfo-nav-item {
      width: 100%;
      height: calc(65vh - 185px);
      padding-right: 10px;
      box-sizing: border-box;
      @include scroll();
      > div {
        width: 100%;
        height: 35px;
        line-height: 35px;
        > span {
          font-size: 15px;
          color: #555;
          margin-right: 5px;
        }
      }
      .resourceInfo-nav-title {
        font-weight: 400;
        font-size: 18px;
      }
      .resourceInfo-nav-location {
        font-size: 14px;
        padding-left: 10px;
        box-sizing: border-box;
        color: #999;
        @include flex(space-between, center, null);
      }
    }
  }
  .resourceInfo-button {
    width: 100%;
    height: 60px;
    @include p-number(15px);
    @include flex(center, null, null);
  }
}
</style>
<style></style>
