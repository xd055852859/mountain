<script setup lang="ts">
import screenBgPng from "@/assets/img/screenBg.png";
import screenChoosePng from "@/assets/img/screenChoose.png";
import screenUnChoosePng from "@/assets/img/screenUnChoose.png";
import screenTitlePng from "@/assets/img/screenTitle.png";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const dayjs: any = inject("dayjs");
const router = useRouter();

const { domain } = storeToRefs(appStore.authStore);
const toUrl = (url: string) => {
  router.push(`/screen/${url}`);
};

</script>
<template>
  <div class="screen">
    <!-- :style="{
      'background-image': `url(${screenBgPng})`,
    }" -->
    <!-- <div class="screen-header">
      <div class="screen-nav">
        <div
          @click="toUrl('home')"
          :style="{
            'background-image':
              $route.name === 'screenHome'
                ? `url(${screenChoosePng})`
                : `url(${screenUnChoosePng})`,
          }"
        >
          数字两山
        </div>
        <div
          @click="toUrl('resource')"
          :style="{
            'background-image':
              $route.name === 'screenResource'
                ? `url(${screenChoosePng})`
                : `url(${screenUnChoosePng})`,
          }"
        >
          项目交易
        </div>
        <div
          @click="toUrl('labour')"
          :style="{
            'background-image':
              $route.name === 'screenLabour'
                ? `url(${screenChoosePng})`
                : `url(${screenUnChoosePng})`,
          }"
        >
          劳务竞标
        </div>
        <div
          @click="toUrl('environment')"
          :style="{
            'background-image':
              $route.name === 'screenEnvironment'
                ? `url(${screenChoosePng})`
                : `url(${screenUnChoosePng})`,
          }"
        >
          环情检测
        </div>
      </div>

      <div
        class="screen-title"
        :style="{
          'background-image': `url(${screenTitlePng})`,
        }"
      >
        {{ domain?.name }}生态大数据
      </div>
      <div class="screen-time">{{titletime}}</div>
    </div>
    <div class="screen-container"><router-view></router-view></div> -->
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.screen {
  width: 100vw;
  height: 100vh;
  @include scroll();
  @include p-number(2%);
  background: #0a071a;
  // background-repeat: no-repeat;
  // background-position: center center;
  // background-size: cover;
  // .screen-header {
  //   width: 100%;
  //   height: 8vh;
  //   position: relative;
  //   z-index: 1;
  //   overflow: hidden;
  //   margin-bottom: 1vh;
  //   @include flex(center, center, null);

  //   .screen-nav {
  //     height: 100%;
  //     position: absolute;
  //     z-index: 2;
  //     top: 0px;
  //     left: 0px;
  //     @include flex(null, center, null);
  //     > div {
  //       width: 6vw;
  //       height: 5vh;
  //       margin-right: 10px;
  //       text-align: center;
  //       line-height: 5vh;
  //       color: #fff;
  //       cursor: pointer;
  //       background-repeat: no-repeat;
  //       background-position: center center;
  //       background-size: 100% 100%;
  //     }
  //   }
  //   .screen-title {
  //     width: 40vw;
  //     height: 100%;
  //     color: #fff;
  //     font-size: 26px;
  //     line-height: 6vh;
  //     // @include flex(center, center, null);
  //     background-repeat: no-repeat;
  //     background-position: center center;
  //     background-size: 110% 250%;
  //     // >div{

  //     // }
  //   }
  //   .screen-time {
  //     height: 100%;
  //     font-size: 12px;
  //     font-weight: 400;
  //     color: #ffffff;
  //     position: absolute;
  //     z-index: 2;
  //     top: 0px;
  //     right: 0px;
  //     @include flex(null, center, null);
  //   }
  // }
  // .screen-container {
  //   width: 100%;
  //   height: 90vh;
  //   color: #fff;
  //   background: rgba(255, 255, 255, 0);
  //   border: 2px solid rgba(57, 181, 255, 0.4);
  //   box-shadow: 0px 0px 100px 0px rgba(44, 176, 255, 0.58);
  //   padding: 10px;
  //   box-sizing: border-box;
  // }
  // .screen-map {
  //   position: fixed;
  //   z-index: 2;
  // }
}
</style>
<style lang="scss">
.screen {
  .screen-title {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
  }
  .screen-item {
    width: 100%;
    height: calc(100% - 40px);
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
