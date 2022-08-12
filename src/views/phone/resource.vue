<script setup lang="ts">
import { ElMessage } from "element-plus";
import resourceBgPng from "@/assets/img/resourceBg.png";
import resource1Png from "@/assets/img/resource1.png";
import resource2Png from "@/assets/img/resource2.png";
import resource3Png from "@/assets/img/resource3.png";
import resource4Png from "@/assets/img/resource4.png";
import resource5Png from "@/assets/img/resource5.png";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { domain } = storeToRefs(appStore.authStore);
const countArray = ref<number[]>([]);
const getCount = async () => {
  const countRes = (await api.request.get(
    "resource/statis",
    {}
  )) as ResultProps;
  if (countRes.msg === "OK") {
    countArray.value = [
      countRes.data.resourceNum,
      countRes.data.offerNum,
      countRes.data.labourNum,
    ];
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getCount();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="resource">
    <div
      class="resource-img"
      :style="{ 'background-image': `url(${resourceBgPng})` }"
    ></div>
    <div class="resource-count dp-space-center">
      <span
        >存入资源:
        <span class="common-color" style="font-size: 20px">{{
          countArray[0]
        }}</span></span
      >
      <span
        >累计交易:
        <span class="common-color" style="font-size: 20px">{{
          countArray[1]
        }}</span></span
      >
      <span
        >劳务项目:
        <span class="common-color" style="font-size: 20px">{{
          countArray[2]
        }}</span></span
      >
    </div>
    <div class="resource-tab">
      <el-card
        class="resource-tab-item"
        shadow="hover"
        :style="{ 'background-image': `url(${resource1Png})` }"
      >
        <div class="tab-info">
          <div>
            <div class="tab-header">存入资源</div>
            <div>存入资源 更放心</div>
          </div>
          <div class="tab-button" @click="$router.push('/resourceForm')">
            立刻存入
          </div>
        </div>
      </el-card>
      <el-card
        class="resource-tab-item"
        shadow="hover"
        :style="{ 'background-image': `url(${resource2Png})` }"
      >
        <div class="tab-info">
          <div>
            <div class="tab-header">资源交易</div>
            <div>购买资源 更便捷</div>
          </div>
          <div
            class="tab-button"
            @click="$router.push('/phone/resourceList/1')"
          >
            立即进入
          </div>
        </div>
      </el-card>
      <el-card
        class="resource-tab-item"
        shadow="hover"
        :style="{ 'background-image': `url(${resource3Png})` }"
      >
        <div class="tab-info">
          <div>
            <div class="tab-header">资源报价</div>
            <div>线上报价 更诚意</div>
          </div>
          <div
            class="tab-button"
            @click="$router.push('/phone/resourceList/2')"
          >
            立即进入
          </div>
        </div>
      </el-card>
      <el-card
        class="resource-tab-item"
        shadow="hover"
        :style="{ 'background-image': `url(${resource4Png})` }"
      >
        <div class="tab-info">
          <div>
            <div class="tab-header">劳务项目</div>
            <div>劳务合作 更轻松</div>
          </div>
          <div
            class="tab-button"
            @click="$router.push('/phone/resourceList/3')"
          >
            立即进入
          </div>
        </div>
      </el-card>
      <el-card
        class="resource-tab-item"
        shadow="hover"
        :style="{ 'background-image': `url(${resource5Png})` }"
      >
        <div class="tab-info">
          <div>
            <div class="tab-header">两山金融</div>
            <div>融资支持 更普惠</div>
          </div>
          <div class="tab-button">立即进入</div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style scoped lang="scss">
.resource {
  width: 100vw;
  height: 100vh;

  .resource-img {
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .resource-count {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 400;
    color: #666666;
    line-height: 55px;
    margin: 10px 0px;
    @include p-number(15px);
  }
  .resource-tab {
    width: 100%;
    height: calc(100vh - 330px);
    margin-bottom: 25px;
    @include scroll();
    @include p-number(15px);
    .resource-tab-item {
      width: 100%;
      height: 155px;
      margin-bottom: 10px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      color: #fff;
      .tab-info {
        width: 100%;
        margin: 30px 0px;
        @include flex(space-between, center, null);
        flex-shrink: 0;
        > div {
          font-size: 14px;
          font-weight: 400;
          color: #d1d1d1;
        }
        .tab-header {
          font-size: 24px;
          color: #fff;
          margin-bottom: 5px;
        }
        .tab-button {
          cursor: pointer;
          padding: 5px 18px;
          color: #fff;
          background: linear-gradient(131deg, #48c064 16%, #6fcd53 82%);
          border-radius: 23px;
        }
      }
    }
  }
}
</style>
<style></style>
