<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import { ResultProps, Tag } from "@/interface/Common";
import { Circle } from "@/interface/Circle";
import api from "@/services/api";
import appStore from "@/store";
import { CirclePlus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import CircleItem from "@/components/circleItem.vue";
import toTopSvg from "@/assets/svg/toTop.svg";
import addCircleSvg from "@/assets/svg/addCircle.svg";
const route = useRoute();
const { token, domain } = storeToRefs(appStore.authStore);
const { circleTag, circleIndex } = storeToRefs(appStore.tagStore);
const { getTag, setCircleIndex } = appStore.tagStore;
const circleList = ref<Circle[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const tabRef = ref<any>(null);
const containerRef = ref(null);
const circleHeight = ref<string>("0px");
const topVisible = ref<boolean>(false);
const getCircleList = async () => {
  let state = false;
  let obj: any = {
    articleType: "Blog",
    page: page.value,
    limit: 30,
  };
  if (circleIndex.value === 100) {
    obj.tabType = "new";
    state = true;
  } else {
    obj.tagKey = circleTag.value[circleIndex.value]._key;
  }
  const tagRes = (await api.request.get("article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    circleList.value = [...circleList.value, ...tagRes.data];
    circleHeight.value =
      document.documentElement.offsetHeight -
      tabRef.value.offsetHeight -
      140 +
      "px";
    total.value = tagRes.total as number;
  }
};
const chooseTag = (index) => {
  setCircleIndex(index);
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
  topVisible.value = scrollTop > height ? true : false;
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
const toTop = () => {
  topVisible.value = false;
  let timer = setInterval(function () {
    //@ts-ignore
    containerRef.value.scrollTop -= 80; // 使高度每次减少20px
    //@ts-ignore
    if (containerRef.value.scrollTop <= 0) {
      clearInterval(timer); // 关闭定时器
    }
  }, 30);
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getTag("Blog");
      getCircleList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader isMenu>
    <template v-slot:title>圈子</template>
    <template v-slot:right>
      <div @click="$router.push('/userCircle')">
        <iconpark-icon name="my" size="24" style="cursor: pointer" />
      </div>
    </template>
  </pHeader>
  <div class="circle">
    <div class="tab dp--center" ref="tabRef">
      <div
        class="tab-item icon-point"
        @click="chooseTag(100)"
        :class="{ 'common-color': circleIndex === 100 }"
      >
        <div><iconpark-icon name="new" size="24" /></div>
        <div>最新</div>
      </div>
      <div
        v-for="(item, index) in circleTag"
        :key="'tag' + index"
        class="tab-item icon-point"
        @click="chooseTag(index)"
        :class="{ 'common-color': circleIndex === index }"
      >
        <div>
          <img :src="item.icon" alt="" v-if="item.icon" />
          <iconpark-icon name="defaultTag" v-else size="24" />
        </div>
        <div>{{ item.name }}</div>
      </div>
    </div>
    <el-divider />
    <div
      class="container"
      @scroll="scrollCircle"
      :style="{ height: circleHeight }"
      ref="containerRef"
    >
      <template v-for="(item, index) in circleList" :key="'circle' + index">
        <circle-item
          :item="item"
          @deleteItem="deleteCircle"
          @changeItem="changeCircle"
        />
      </template>
      <div class="toTop icon-point" v-if="topVisible" @click="toTop">
        <img :src="toTopSvg" alt="" style="width: 45px; height: 45px" />
      </div>
    </div>
    <div
      class="button icon-point"
      @click="token ? $router.push('/phoneAddCircle') : $router.push('/login')"
    >
      <img :src="addCircleSvg" alt="" style="width: 35px; height: 35px" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.circle {
  width: 100%;
  height: calc(100% - 55px);
  @include p-number(15px);
  .tab {
    width: 100%;
    flex-wrap: wrap;
    .tab-item {
      width: 25%;
      height: 50px;
      margin-bottom: 10px;
      color: #666;
      font-size: 14px;
      > div {
        width: 100%;
        @include flex(center, center, null);
        &:nth-child(1) {
          margin-bottom: 8px;
        }
      }
    }
  }
  .container {
    width: 100%;
    @include scroll();
    .toTop {
      position: fixed;
      z-index: 5;
      right: 15px;
      bottom:90px;
    }
  }
  .button {
    position: fixed;
    right: 20px;
    bottom: 50px;
    z-index: 5;
  }
}
</style>
<style></style>
