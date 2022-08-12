<script setup lang="ts">
import cHeader from "@/components/computer/cHeader.vue";
import { ResultProps, Tag } from "@/interface/Common";
import { Circle } from "@/interface/Circle";
import api from "@/services/api";
import appStore from "@/store";
import { CirclePlus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import CircleItem from "../../components/circleItem.vue";
import AddCircle from "../phone/addCircle.vue";
import { onBeforeRouteLeave } from "vue-router";

const route = useRoute();
const { user, domain } = storeToRefs(appStore.authStore);
const { circleTag } = storeToRefs(appStore.tagStore);
const { tabType } = storeToRefs(appStore.commonStore);
const circleList = ref<Circle[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const tabRef = ref<any>(null);

onBeforeRouteLeave(() => {
  changeTab();
});
const getCircleList = async () => {
  let state = false;
  let obj: any = {
    articleType: "Blog",
    page: page.value,
    limit: 30,
  };
  if (tabType.value === 100) {
    obj.tabType = "new";
    state = true;
  } else {
    obj.tagKey = circleTag.value[tabType.value]._key;
  }
  const tagRes = (await api.request.get("article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    circleList.value = [...circleList.value, ...tagRes.data];
    total.value = tagRes.total as number;
  }
};
const addCircleList = (item) => {
  if (
    tabType.value === 100 ||
    circleTag.value[tabType.value]._key === item.tagInfo._key
  ) {
    circleList.value.unshift(item);
  }
};
const chooseTag = (index) => {
  page.value = 1;
  circleList.value = [];
  getCircleList();
};
const scrollCircle = (e: any) => {
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
    getCircleList();
  }
};
const deleteCircle = (key) => {
  circleList.value = circleList.value.filter(
    (item: Circle) => item._key !== key
  );
};
const changeCircle = (circleItem) => {
  console.log(circleItem);
  let index = circleList.value.findIndex(
    (item: Circle) => item._key === circleItem._key
  );
  console.log(index);
  if (index !== -1) {
    circleList.value[index] = { ...circleList.value[index], ...circleItem };
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getCircleList();
    }
  },
  { immediate: true }
);
const changeTab = watch(tabType, () => {
    page.value = 1;
    circleList.value = [];
    getCircleList();
});
</script>
<template>
  <cHeader />
  <div class="circle">
    <div class="circle-box">
      <template v-if="user">
        <AddCircle @addCircleList="addCircleList" />
        <el-divider
      /></template>
      <div class="container" @scroll="scrollCircle">
        <template v-for="(item, index) in circleList" :key="'circle' + index">
          <circle-item
            :item="item"
            @deleteItem="deleteCircle"
            @changeItem="changeCircle"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.circle {
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .circle-box {
    width: 85vw;
    min-width: 650px;
    padding-top: 40px;
    box-sizing: border-box;
    .container {
      width: 100%;
    }
    .button {
      position: fixed;
      right: 20px;
      bottom: 50px;
      z-index: 5;
    }
  }
}
</style>
<style></style>
