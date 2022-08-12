<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
import ResourceItem from "@/components/resourceItem.vue";
import cHeader from "@/components/computer/cHeader.vue";

import homePng from "@/assets/img/home.png";
const { domain, token, user } = storeToRefs(appStore.authStore);
const searchInput = ref<string>("");
const tabType = ref<number>(1);

const homeList = ref<{
  allowOfferList: Resource[];
  labourList: Resource[];
  resourceList: Resource[];
} | null>();
const getHomeList = async () => {
  const resourceRes = (await api.request.get(
    "resource/newest",
    {}
  )) as ResultProps;
  if (resourceRes.msg === "OK") {
    homeList.value = { ...resourceRes.data };
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getHomeList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="computer-home">
    <div class="computer-top">
      <div class="banner" v-if="domain?.banner">
        <el-carousel
          trigger="click"
          height="540px"
          v-if="domain.banner.length > 1"
        >
          <el-carousel-item v-for="item in domain.banner" :key="item">
            <div class="banner-item"><img :src="item" alt="" /></div>
          </el-carousel-item>
        </el-carousel>
        <div v-else class="banner-img">
          <img :src="domain.banner[0] ? domain?.banner[0] : homePng" alt="" />
        </div>
      </div>
      <div class="top-box">
        <div class="tab">
          <div :class="{ 'choose-nav': tabType === 1 }" @click="tabType = 1">
            找资源
          </div>
          <div :class="{ 'choose-nav': tabType === 2 }" @click="tabType = 2">
            找报价
          </div>
          <div :class="{ 'choose-nav': tabType === 3 }" @click="tabType = 3">
            找项目
          </div>
        </div>
      </div>
      <div class="input top-box">
        <el-input
          v-model="searchInput"
          placeholder="请输入名称"
          style="width: 60vw"
          @change="
            searchInput
              ? $router.push({
                  name: 'searchResource',
                  params: {
                    searchName: searchInput,
                    tabType: tabType,
                  },
                })
              : null
          "
        />
      </div>
      <div class="button top-box">
        <el-button
          type="success"
          style="width: 150px; height: 40px"
          round
          @click="$router.push('/resourceForm')"
          v-if="user"
          >我有资源要上报</el-button
        >
      </div>
    </div>
    <div class="computer-home-container" v-if="homeList">
      <div class="computer-home-item">
        <div class="title">
          <div>资源交易</div>
          <div
            @click="$router.push('/computer/resourceList/1')"
            class="icon-point"
          >
            查看更多资源
            <el-icon style="margin-left: 5px"><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="common-box">
          <div
            class="common-info"
            v-for="(item, index) in homeList.resourceList"
            :key="'resource' + index"
          >
            <ResourceItem :item="item" :tabType="1" type="home" />
          </div>
        </div>
      </div>
      <div class="computer-home-item">
        <div class="title">
          <div>资源报价</div>
          <div
            @click="$router.push('/computer/resourceList/2')"
            class="icon-point"
          >
            更多资源报价
            <el-icon style="margin-left: 5px"><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="common-box">
          <div
            class="common-info"
            v-for="(item, index) in homeList.allowOfferList"
            :key="'resource' + index"
          >
            <ResourceItem :item="item" :tabType="2" type="home" />
          </div>
        </div>
      </div>
      <div class="computer-home-item">
        <div class="title">
          <div>劳务项目</div>
          <div
            @click="$router.push('/computer/resourceList/3')"
            class="icon-point"
          >
            更多劳务项目
            <el-icon style="margin-left: 5px"><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="common-box">
          <div
            class="common-info"
            v-for="(item, index) in homeList.labourList"
            :key="'resource' + index"
          >
            <ResourceItem :item="item" :tabType="3" type="home" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-home {
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  @include scroll();
  .computer-top {
    width: 100%;
    height: 540px;
    align-content: flex-end;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
    @include flex(center, center, wrap);
    .banner {
      width: 100%;
      height: 540px;
      position: absolute;
      z-index: 2;
      // @include flex(center, center, null);
      .banner-item,.banner-img {
        width: 100vw;
        height: 540px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .top-box {
      width: 100%;
      @include flex(center, center, null);
      position: relative;
      z-index: 5;
    }
    .title {
      width: 60vw;
      height: 70px;
      font-size: 30px;
      margin-bottom: 30px;
    }
    .tab {
      width: 60vw;
      height: 40px;
      margin-bottom: 30px;
      color: #fff;
      @include flex(center, center, null);
      > div {
        height: 100%;

        cursor: pointer;
        @include flex(center, center, null);
        &:nth-child(2) {
          margin: 0px 30px;
        }
      }

      .choose-nav {
        @include choose-border(3px);
      }
    }
    .input {
      margin-bottom: 30px;
    }
    .button {
      height: 40px;
      margin-bottom: 80px;
    }
  }
  .computer-home-container {
    @include flex(center, null, wrap);
    .computer-home-item {
      width: 85vw;
      min-width: 650px;
      margin-bottom: 30px;

      .title {
        width: 100%;
        height: 35px;
        margin-bottom: 20px;
        font-size: 24px;
        @include flex(space-between, center, null);
        :nth-child(2) {
          font-size: 14px;
          color: #777;
          @include flex(null, center, null);
        }
      }
      // .computer-home-info {
      //   width: calc(50% - 15px);
      // }
    }
  }
}
</style>
<style lang="scss">
.computer-home {
  .input {
    margin-bottom: 70px;
    .el-input__wrapper {
      border-radius: 30px;
      padding-left: 18px;
      padding-right: 18px;
    }
  }
}
</style>
