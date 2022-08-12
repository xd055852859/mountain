<script setup lang="ts">
import appStore from "@/store";
import pHeader from "@/components/phone/pHeader.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { Circle } from "@/interface/Circle";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import CircleItem from "@/components/circleItem.vue";

const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const circleList = ref<Circle[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);

const getCircleResList = async () => {
  const circleRes = (await api.request.get("article/mine", {
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (circleRes.msg === "OK") {
    circleList.value = [...circleList.value, ...circleRes.data];
    total.value = circleRes.total as number;
  }
};

const scrollResourceList = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    circleList.value.length < total.value
  ) {
    page.value++;
    getCircleResList();
  }
};
const deleteCircle = (key) => {
  circleList.value = circleList.value.filter((item) => item._key !== key);
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getCircleResList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader>
    <template v-slot:title>我的圈子</template>
  </pHeader>
  <div class="environmentList">
    <div class="environmentList-container" @scroll="scrollResourceList">
      <template v-for="(item, index) in circleList" :key="'circle' + index">
        <circle-item :item="item" @deleteItem="deleteCircle" />
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.environmentList {
  width: 100vw;
  height: 100vh;

  .environmentList-container {
    width: 100%;
    height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 10px;
    @include p-number(15px);
  }
}
</style>
<style></style>
