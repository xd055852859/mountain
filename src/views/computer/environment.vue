<script setup lang="ts">
import { ElMessage } from "element-plus";
import EnvironmentForm from "../environmentForm.vue";
import EnvironmentItem from "@/components/environmentItem.vue";
import CommonMap from "@/components/commonMap.vue";
import api from "@/services/api";
import { Environment } from "@/interface/Resource";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";

const { domain, user } = storeToRefs(appStore.authStore);
const containerRef = ref<any>(null);
const formRef = ref<any>(null);
const mapRef = ref<any>(null);
const page = ref<number>(1);
const total = ref<number>(0);
const pointArray = ref<{ lnglat: string[]; regionCode: number }[]>([]);
const environmentList = ref<Environment[]>([]);
const getEnvironmentList = async () => {
  const resourceRes = (await api.request.get("event/list", {
    page: page.value,
    limit: 12,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    pointArray.value = [];
    environmentList.value = [...resourceRes.data];
    total.value = resourceRes.total as number;
    environmentList.value.forEach((item, index) => {
      if (item.location && item.location.length > 0) {
        console.log(item.location);
        pointArray.value.push({
          lnglat: [item.location[0] + "", item.location[1] + ""],
          regionCode: item.regionCode,
        });
      }
    });
    console.log(pointArray.value);
  }
};
const addEnvironmentList = (item) => {
  environmentList.value.push(item);
  pointArray.value.push({
    lnglat: [item.location[0] + "", item.location[1] + ""],
    regionCode: item.regionCode,
  });
  mapRef.value.setCluster(pointArray.value);
  // mapRef.value.clearMap();
};
const changeTopAddress = (mapName, mapAddress) => {
  formRef.value.changeAddress(mapName, mapAddress);
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getEnvironmentList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="computer-environment">
    <div class="top" v-if="user">
      <CommonMap
        :mapId="'computerMap'"
        :width="'65vw'"
        :height="'890px'"
        @setName="changeTopAddress"
        ref="mapRef"
        :pointArray="pointArray"

      />
      <div ref="containerRef">
        <EnvironmentForm @addItem="addEnvironmentList" ref="formRef" />
      </div>
    </div>
    <div class="environment-box">
      <div class="environmentList-container common-box">
        <div
          class="common-info"
          v-for="(item, index) in environmentList"
          :key="'environmentList' + index"
        >
          <environment-Item :item="item" v-if="item" />
        </div>
      </div>
      <div class="page">
        <el-pagination
          v-model:currentPage="page"
          background
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="
            (newPage) => {
              page = newPage;
              getEnvironmentList();
            }
          "
          :page-size="12"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-environment {
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .top {
    height: 863px;
    @include flex(space-between, center, null);
    margin-top: 40px;
  }
  .environment-box {
    width: 85vw;
    min-width: 650px;
    padding-top: 40px;
    box-sizing: border-box;

    .environmentList-container {
      width: 100%;
      margin-top: 20px;
      @include p-number(15px);
    }
    .page {
      width: 100%;
      margin: 15px 0px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
