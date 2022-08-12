<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import environment1Png from "@/assets/img/environment1.png";
import environment2Png from "@/assets/img/environment2.png";
import environment3Png from "@/assets/img/environment3.png";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { domain, token, user } = storeToRefs(appStore.authStore);
onMounted(() => {});
</script>
<template>
  <pHeader isMenu>
    <template v-slot:title>环境上报</template>
  </pHeader>
  <div class="environment-tab">
    <el-card
      class="environment-tab-item"
      shadow="hover"
      :style="{
        'background-image': `url(${
          domain?.banner && domain?.banner.length > 0
            ? domain?.banner[0]
            : environment1Png
        })`,
      }"
    >
      <div class="tab-info">
        <div>
          <div class="tab-header">一键上报</div>
          <div>存入资源 更放心</div>
        </div>
        <div class="tab-button-box">
          <div class="tab-button" @click="$router.push('/environmentForm')">
            立刻上报
          </div>
        </div>
      </div>
    </el-card>
    <el-card
      class="environment-tab-item"
      shadow="hover"
      :style="{ 'background-image': `url(${environment2Png})` }"
    >
      <div class="tab-info">
        <div>
          <div class="tab-header">我的上报</div>
          <div>存入资源 更放心</div>
        </div>
        <div class="tab-button-box">
          <div class="tab-button" @click="$router.push('/userEnvironmentList')">
            查看我的
          </div>
        </div>
      </div>
    </el-card>
    <el-card
      class="environment-tab-item"
      shadow="hover"
      :style="{ 'background-image': `url(${environment3Png})` }"
    >
      <div class="tab-info">
        <div>
          <div class="tab-header">管护公开</div>
          <div>存入资源 更放心</div>
        </div>
        <div class="tab-button-box">
          <div class="tab-button" @click="$router.push('/userEnvironmentList')">
            立即查看
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style scoped lang="scss">
.environment-tab {
  width: 100%;
  height: calc(100vh - 60px);
  @include scroll();
  @include p-number(15px);
  .environment-tab-item {
    height: 155px;
    margin-bottom: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    color: #fff;
    .tab-info {
      width: 100%;
      flex-shrink: 0;
      margin-top: 5px;
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
      .tab-button-box {
        margin-top: 15px;
        @include flex(flex-end, center, null);
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
