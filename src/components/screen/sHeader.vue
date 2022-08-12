<script setup lang="ts">
import { ElMessage } from "element-plus";
import screenHeaderPng from "@/assets/img/screenHeader.png";
const dayjs: any = inject("dayjs");
const datetime = ref<string>("");

const minutetime = ref<string>("");
const titletimer = ref<any>(0);
onMounted(() => {
  titletimer.value = setInterval(() => {
    titletime.value = dayjs().format("YYYY年M月DD日-HH:mm分:秒");
  }, 1000);
});
onUnmounted(() => {
  clearInterval(titletimer.value);
  titletimer.value = null;
  titletime.value = 0;
});
</script>
<template>
  <div
    class="screen-header"
    :style="{
      'background-image': `url(${screenHeaderPng})`,
    }"
  >
    <div>
      <div></div>
      <div></div>
    </div>
    <div>万安县两山生态资源大数据平台</div>
    <div>2022年6月21日(八月十九) 星期三 14:42:15</div>
  </div>
</template>
<style scoped lang="scss">
.screen-header {
  width: 100vw;
  height: 10vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
</style>
<style></style>
