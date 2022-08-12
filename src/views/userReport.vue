<script setup lang="ts">
import appStore from "@/store";
import api from "@/services/api";
import pHeader from "@/components/phone/pHeader.vue";
import ResourceItem from "@/components/resourceItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ResultProps } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const reportType = ref<number>(0);
const reportList = ref<Resource[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getUserReport = async () => {
  reportType.value = +(route.params.id as string);
  const reportRes = (await api.request.get("user/resource", {
    type: reportType.value,
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (reportRes.msg === "OK") {
    reportList.value = [...reportList.value, ...reportRes.data];
    total.value = reportRes.total as number;
    console.log(reportList.value);
  }
};
const scrollReport = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    reportList.value.length < total.value
  ) {
    page.value++;
    getUserReport();
  }
};
const deleteReport = (key) => {
  let index = reportList.value.findIndex((item: Resource) => item._key === key);
  if (index !== -1) {
    reportList.value.splice(index, 1);
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getUserReport();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader>
    <template v-slot:title>{{
      reportType === 1
        ? "我的资源"
        : reportType === 2
        ? "资源意向"
        : reportType === 3
        ? "资源参拍"
        : "劳务报名"
    }}</template>
  </pHeader>
  <div class="userReport" @scroll="scrollReport">
    <template v-for="(item, index) in reportList" :key="'resourceList' + index">
      <resource-Item
        :item="item"
        :tabType="reportType"
        :type="'mine'"
        v-if="item"
        @deleteItem="deleteReport"
      />
    </template>
  </div>
</template>
<style scoped lang="scss">
.userReport {
  width: 100%;
  height: calc(100vh - 60px);
  @include p-number(15px);
  @include scroll();
}
</style>
<style></style>
