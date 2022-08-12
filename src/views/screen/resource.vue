<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import CommonMap from "@/components/commonMap.vue";
import CategoryChart from "@/components/chart/categoryChart.vue";
import PieChart from "@/components/chart/pieChart.vue";
const { token, domain } = storeToRefs(appStore.authStore);
const avgName = ref<string[]>([]);
const avgNum = ref<number[]>([]);
const townName = ref<string[]>([]);
const townNum = ref<number[]>([]);
const monthName = ref<string[]>([]);
const monthNum = ref<number[]>([]);
const inProgressNum = ref<number>(0);
const endNum = ref<number>(0);
const tagResource = ref<{ name: string; count: number; value: number }[]>([]);
const allOfferResource = ref<{ name: string; count: number; code: number }[]>(
  []
);
const townResource = ref<
  {
    name: string;
    count: number;
    value: number;
    code: string;
    fullAreaName: string;
  }[]
>([]);
const getResourceData = async () => {
  const dataRes = (await api.request.get(
    "summary/resource/allowOffer"
  )) as ResultProps;
  if (dataRes.msg === "OK") {
    dataRes.data.townAvg.forEach((item) => {
      avgName.value.push(item.name);
      avgNum.value.push(item.avgRent);
    });
    tagResource.value = dataRes.data.tagResource.map((item) => {
      item.value = item.count;
      return item;
    });
    dataRes.data.monthResource.forEach((item) => {
      monthName.value.push(item.ctime);
      monthNum.value.push(item.count);
    });
    dataRes.data.townResource.forEach((item) => {
      townName.value.push(item.name);
      townNum.value.push(item.count);
    });
    townResource.value = dataRes.data.townResource;
    endNum.value = dataRes.data.endNum;
    inProgressNum.value = dataRes.data.inProgressNum;
    // inProgressNum
    // endNum
    // monthResource
    // townResource
    // //地图
    // allOfferResource
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getResourceData();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="screen-resource">
    <div class="left">
      <div class="top">
        <div class="screen-title">各乡镇年租金均价</div>
        <div class="screen-item" v-if="avgName.length > 0">
          <CategoryChart
            :categoryId="'resourceAvgId'"
            :categoryData="avgName"
            :seriesData="avgNum"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">各类型资源交易占比</div>
        <div class="screen-item" v-if="tagResource.length > 0">
          <PieChart
            :pieId="'resourcePieId'"
            :pieData="tagResource"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center-title">
        <div class="center-title-item">
          <div>交易中</div>
          <div class="center-title-num">{{ inProgressNum }} 个资源</div>
        </div>
        <div class="center-title-item">
          <div>已完成</div>
          <div class="center-title-num">{{ endNum }} 个资源</div>
        </div>
      </div>
      <div class="center-map" v-if="townResource">
        <!--       :pointCode="allOfferResource" -->
        <CommonMap
          :mapId="'resourceMap'"
          :point-code="townResource"
          :width="'calc(100% - 30px)'"
          :height="'80%'"
          type="screen"
        />
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div class="screen-title">各月交易同比新增</div>
        <div class="screen-item" v-if="monthName.length > 0">
          <CategoryChart
            :categoryId="'resourceMonthId'"
            :categoryData="monthName"
            :seriesData="monthNum"
            :width="'100%'"
            :height="'100%'"
            :type="'vertical'"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">各乡镇交易资源数量</div>
        <div class="screen-item" v-if="townName.length > 0">
          <CategoryChart
            :categoryId="'resourceTownId'"
            :categoryData="townName"
            :seriesData="townNum"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.screen-resource {
  width: 100%;
  height: 100%;
  @include flex(space-between, center, null);
  .left {
    width: 35%;
    height: 100%;
    .top {
      width: 100%;
      height: 50%;
    }
    .bottom {
      width: 100%;
      height: 50%;
    }
  }
  .center {
    width: 40%;
    height: 100%;
    @include flex(center, null, wrap);
    .center-title {
      width: 100%;
      height: 100px;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom:15px;
      @include flex(space-between, center, null);

      .center-title-item {
        width: 48%;
        > div {
          height: 40px;
        }
        .center-title-num {
          font-size: 20px;
          text-align: right;
        }
      }
    }
    .center-map {
      width: 100%;
      height: calc(100% - 115px);
      @include flex(center, null, null);
    }
  }
  .right {
    width: 35%;
    height: 100%;
    .top {
      width: 100%;
      height: 35%;
    }
    .bottom {
      width: 100%;
      height: 65%;
    }
  }
}
</style>
<style></style>
