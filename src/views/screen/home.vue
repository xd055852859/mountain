<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NightingaleChart from "@/components/chart/nightingaleChart.vue";
import CommonMap from "@/components/commonMap.vue";
const dayjs: any = inject("dayjs");
const { token, domain } = storeToRefs(appStore.authStore);
const townResource = ref<
  {
    name: string;
    count: number;
    value: number;
    code: string;
    fullAreaName: string;
  }[]
>([]);
const newResourceList = ref<
  {
    area: number;
    areaName: string;
    name: string;
    unit: string;
    userName: string;
    _key: string;
    areaNum: string;
  }[]
>([]);
const countyResource = ref<
  {
    count: number;
    name: string;
    town: string;
  }[]
>([]);
const mapRef = ref<any>(null);
onMounted(() => {
  // console.log()
});
const getHomeData = async () => {
  const dataRes = (await api.request.get("summary/resource")) as ResultProps;
  if (dataRes.msg === "OK") {
    townResource.value = dataRes.data.townResource.map((item) => {
      item.value = item.count;
      return item;
    });
    newResourceList.value = dataRes.data.newResourceList.map((item) => {
      item.areaNum = item.area + item.unit;
      return item;
    });
    console.log(newResourceList.value);
    countyResource.value = [...dataRes.data.countyResource];
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getHomeData();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="screen-home">
    <div class="left">
      <div class="top">
        <div class="top-left">
          <!-- <div class="top-left-top"> -->
          <div class="screen-title">各乡镇资产资源数量</div>
          <div class="screen-item">
            <el-table :data="townResource" height="100%" style="width: 100%">
              <el-table-column
                type="index"
                label="排名"
                :align="'center'"
                width="70px"
              />
              <el-table-column
                prop="count"
                label="数量"
                :align="'center'"
                width="70px"
              />
              <el-table-column prop="name" label="乡镇" :align="'center'" />
            </el-table>
          </div>
          <!-- </div> -->
          <!-- <div class="top-left-bottom">
            <div>累计土地资源面积</div>
            <div>累计托管土地资源: {{}}万m²</div>
          </div> -->
        </div>
        <div class="top-right">
          <div class="screen-title">
            总资源数 {{ townResource.length }} 统计数据截止与
            {{ dayjs().format("YYYY年MM月") }}
          </div>
          <div class="screen-item" ref="mapRef">
            <!--   -->
            <CommonMap
              :mapId="'homeMap'"
              :point-code="townResource"
              :width="'100%'"
              :height="'100%'"
              type="screen"
              hasWeather
              v-if="townResource"
            />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">集体资源表</div>
        <div class="screen-item">
          <el-table :data="newResourceList" height="100%" style="width: 100%">
            <el-table-column
              prop="name"
              label="资源名"
              :header-align="'center'"
            />
            <el-table-column
              prop="userName"
              label="权利人"
              :align="'center'"
              width="120px"
            />
            <el-table-column
              prop="areaName"
              label="位置"
              :header-align="'center'"
            />
            <el-table-column
              prop="areaNum"
              label="面积"
              :align="'center'"
              width="120px"
            />
          </el-table>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div class="screen-title">资源托管数村落排名</div>
        <div class="screen-item">
          <el-table :data="countyResource" height="100%" style="width: 100%">
            <el-table-column
              type="index"
              label="排名"
              :align="'center'"
              width="70px"
            />
            <el-table-column prop="name" label="坐落" :align="'center'" />
            <el-table-column
              prop="count"
              label="数量"
              :align="'center'"
              width="70px"
            />
            <el-table-column
              prop="town"
              label="乡镇"
              :header-align="'center'"
            />
          </el-table>
        </div>
      </div>
      <!-- <div>资源托管面积村落排名</div> -->
      <div class="bottom">
        <div class="screen-title">各乡镇资源托管数量</div>
        <div class="screen-item" v-if="townResource.length > 0">
          <NightingaleChart
            :nightingaleId="'homeNightingale'"
            :nightingaleData="townResource"
            :width="'100%'"
            :height="'95%'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.screen-home {
  width: 100%;
  height: 100%;
  @include flex(space-between, center, null);
  .left {
    width: 70%;
    height: 100%;
    .top {
      width: 100%;
      height: 60%;
      @include flex(space-between, center, null);
      .top-left {
        width: 40%;
        height: 100%;
        // .top-left-top {
        //   width: 100%;
        //   height: calc(100% - 100px);
        // }
        // .top-left-bottom {
        //   width: 100%;
        //   height: 100px;
        // }
      }
      .top-right {
        width: 60%;
        height: 100%;
      }
    }
    .bottom {
      width: 100%;
      height: 40%;
    }
  }
  .right {
    width: 30%;
    height: 100%;
    .top {
      width: 100%;
      height: 70%;
    }
    .bottom {
      width: 100%;
      height: 30%;
    }
  }
}
</style>
<style></style>
