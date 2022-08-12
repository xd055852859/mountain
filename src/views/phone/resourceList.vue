<script setup lang="ts">
import appStore from "@/store";
import pHeader from "@/components/phone/pHeader.vue";
import ResourceItem from "@/components/resourceItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const resourceList = ref<Resource[]>([]);
const tabType = ref<number>(0);
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const starIndex = ref<number | null>(null);
const townArray = ref<Region[]>([]);
const townCode = ref<string>("");
const rentIndex = ref<number | null>(null);
const page = ref<number>(1);
const total = ref<number>(0);
const tabArray = ["资源交易", "资源报价", "劳务项目"];
const starArray = [3, 2, 1, 0];
const rentArray = [
  { id: 0, label: "0-500万" },
  { id: 1, label: "500万-1000万" },
  { id: 2, label: "1000-3000万" },
  { id: 3, label: "3000万以上" },
];
const getResourceList = async () => {
  tabType.value = +route.params.id;
  if (tabType.value) {
    let state = false;
    let obj: any = {
      tabType: tabType.value,
      limit: 30,
    };
    if (tagKey.value) {
      obj.tagKey = tagKey.value;
      state = true;
    }
    if (starIndex.value !== null) {
      obj.star = starIndex.value;
      state = true;
    }
    if (townCode.value) {
      obj.regionCode = townCode.value;
      state = true;
    }
    if (rentIndex.value !== null) {
      if (tabType.value === 1) {
        switch (rentIndex.value) {
          case 0:
            obj.rentMin = 0;
            obj.rentMax = 5000000;
            break;
          case 1:
            obj.rentMin = 5000000;
            obj.rentMax = 10000000;
            break;
          case 2:
            obj.rentMin = 10000000;
            obj.rentMax = 30000000;
            break;
          case 3:
            obj.rentMin = 30000000;
            break;
        }
      } else if (tabType.value === 2) {
        switch (rentIndex.value) {
          case 0:
            obj.offerMin = 0;
            obj.offerMax = 5000000;
            break;
          case 1:
            obj.offerMin = 5000000;
            obj.offerMax = 10000000;
            break;
          case 2:
            obj.offerMin = 10000000;
            obj.offerMax = 30000000;
            break;
          case 3:
            obj.offerMin = 30000000;
            break;
        }
      }
      state = true;
    }
    if (state) {
      page.value = 1;
      obj.page = 1;
      resourceList.value = [];
    } else {
      obj.page = page.value;
    }
    const resourceRes = (await api.request.get("resource", {
      ...obj,
    })) as ResultProps;
    if (resourceRes.msg === "OK") {
      resourceList.value = [...resourceList.value, ...resourceRes.data];
      total.value = resourceRes.total as number;
    }
  }
};
const getRegion = async (code: string) => {
  const regionRes = (await api.request.get("regionCode/subByCode", {
    code: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    townArray.value = [...regionRes.data];
  }
};
const getTag = async () => {
  const tagRes = (await api.request.get("tag", {
    tagType: tabType.value === 3 ? "Labour" : "Resource",
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    tagList.value = [...tagRes.data];
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
    resourceList.value.length < total.value
  ) {
    page.value++;
    getResourceList();
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getRegion(newVal?.regionCode);
    }
  },
  { immediate: true }
);
watch(tabType, () => {
  getTag();
});
watchEffect(() => {
  if (domain.value && route.name === "phoneResourceList") {
    getResourceList();
  }
});
</script>
<template>
  <pHeader>
    <template v-slot:title>{{ tabArray[tabType - 1] }}</template>
  </pHeader>
  <div class="resourceList">
    <el-row :gutter="10" class="resourceList-nav">
      <el-col :span="6" v-if="domain?.level && domain.level < 5">
        <el-select
          v-model="townCode"
          :placeholder="`所属${
            domain.level === 1
              ? '市'
              : domain.level === 2
              ? '区县'
              : domain.level === 3
              ? '乡镇'
              : '村'
          }`"
          clearable
        >
          <el-option
            v-for="(item, index) in townArray"
            :key="'town' + index"
            :label="item.name"
            :value="item.areaCode"
          /> </el-select
      ></el-col>
      <el-col :span="6">
        <el-select v-model="tagKey" placeholder="类型" clearable>
          <el-option
            v-for="(item, index) in tagList"
            :key="'tag' + index"
            :label="item.name"
            :value="item._key"
          /> </el-select
      ></el-col>
      <template v-if="tabType !== 3">
        <el-col :span="6">
          <el-select v-model="starIndex" placeholder="星级" clearable>
            <el-option
              v-for="(item, index) in starArray"
              :key="'star' + index"
              :label="item"
              :value="item"
            /> </el-select
        ></el-col>
        <el-col :span="6">
          <el-select
            v-model="rentIndex"
            :placeholder="tabType === 1 ? '金额' : '起始价'"
            clearable
          >
            <el-option
              v-for="(item, index) in rentArray"
              :key="'rent' + index"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </template>
    </el-row>
    <div class="resourceList-container" @scroll="scrollResourceList">
      <template
        v-for="(item, index) in resourceList"
        :key="'resourceList' + index"
      >
        <resource-Item :item="item" :tabType="tabType" v-if="item" />
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.resourceList {
  width: 100vw;
  height: 100vh;
  .resourceList-nav {
    @include p-number(15px);
  }
  .resourceList-container {
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
