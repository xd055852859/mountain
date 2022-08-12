<script setup lang="ts">
import appStore from "@/store";
import ResourceItem from "@/components/resourceItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const route = useRoute();
const { domain, token } = storeToRefs(appStore.authStore);
const { tabType } = storeToRefs(appStore.commonStore);
const resourceList = ref<Resource[]>([]);
const tagList = ref<Tag[]>([]);
const tagKey = ref<string>("");
const starIndex = ref<number | null>(null);
const townArray = ref<Region[]>([]);
const townCode = ref<string>("");
const rentIndex = ref<number | null>(null);
const page = ref<number>(1);
const total = ref<number>(0);
const starArray = [3, 2, 1, 0];
const rentArray = [
  { id: 0, label: "0-500万" },
  { id: 1, label: "500万-1000万" },
  { id: 2, label: "1000-3000万" },
  { id: 3, label: "3000万以上" },
];

onBeforeRouteLeave(() => {
  change();
  changeTab()
});
const getResourceList = async () => {
  if (tabType.value) {
    let obj: any = {
      tabType: tabType.value,
      limit: 12,
      page: page.value,
    };
    if (tagKey.value) {
      obj.tagKey = tagKey.value;
    }
    if (starIndex.value !== null) {
      obj.star = starIndex.value;
    }
    if (townCode.value) {
      obj.regionCode = townCode.value;
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
    }
    const resourceRes = (await api.request.get("resource", {
      ...obj,
    })) as ResultProps;
    if (resourceRes.msg === "OK") {
      resourceList.value = [...resourceRes.data];
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

watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getRegion(newVal?.regionCode);
      getTag();
    }
  },
  { immediate: true }
);
const changeTab = watch(tabType, () => {
  resourceList.value = [];
  page.value = 1;
  getTag();
});
const change = watchEffect(() => {
  getResourceList();
});
</script>
<template>
  <div class="resourceList">
    <div class="resourceList-box">
      <div class="resourceList-nav">
        <div class="nav-item" v-if="domain?.level && domain.level < 5">
          <div class="left">
            所属{{
              domain.level === 1
                ? "市"
                : domain.level === 2
                ? "区县"
                : domain.level === 3
                ? "乡镇"
                : "村"
            }}
          </div>
          <div class="right">
            <div
              @click="townCode = ''"
              :class="{ 'choose-item': townCode === '' }"
            >
              全部
            </div>
            <div
              v-for="(item, index) in townArray"
              :key="'town' + index"
              @click="townCode = item.areaCode"
              :class="{ 'choose-item': townCode === item.areaCode }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <div class="nav-item">
          <div class="left">类型</div>
          <div class="right">
            <div @click="tagKey = ''" :class="{ 'choose-item': tagKey === '' }">
              全部
            </div>
            <div
              v-for="(item, index) in tagList"
              :key="'town' + index"
              @click="tagKey = item._key"
              :class="{ 'choose-item': tagKey === item._key }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <template v-if="tabType !== 3">
          <div class="nav-item">
            <div class="left">星级</div>
            <div class="right">
              <div
                @click="starIndex = null"
                :class="{ 'choose-item': starIndex === null }"
              >
                全部
              </div>
              <div
                v-for="(item, index) in starArray"
                :key="'star' + index"
                @click="starIndex = item"
                :class="{ 'choose-item': starIndex === item }"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div class="nav-item">
            <div class="left">{{ tabType === 1 ? "金额" : "起始价" }}</div>
            <div class="right">
              <div
                @click="rentIndex = null"
                :class="{ 'choose-item': rentIndex === null }"
              >
                全部
              </div>
              <div
                v-for="(item, index) in rentArray"
                :key="'rent' + index"
                @click="rentIndex = item.id"
                :class="{ 'choose-item': rentIndex === item.id }"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div
        class="resourceList-button"
        @click="$router.push('/resourceForm')"
        v-if="tabType === 1 && token"
      >
        <div>存入资源</div>
        <div>登记我的资源，录入到平台</div>
      </div>
      <div class="resourceList-container common-box">
        <div
          class="common-info"
          v-for="(item, index) in resourceList"
          :key="'resourceList' + index"
        >
          <resource-Item :item="item" :tabType="tabType" v-if="item" />
        </div>
      </div>
      <div class="page">
        <el-pagination
          v-model:currentPage="page"
          background
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="
            (newPage) => {
              page = newPage;
              getResourceList();
            }
          "
          :page-size="12"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.resourceList {
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .resourceList-box {
    width: 85vw;
    min-width: 650px;
    .resourceList-nav {
      margin: 40px 0px;
      .nav-item {
        margin-bottom: 10px;
        align-content: flex-start;
        @include flex(null, flex-start, null);
        .left {
          width: 80px;
          height: 30px;
          padding: 5px 10px;
          @include flex(center, center, null);
        }
        .right {
          width: calc(100% - 90px);
          color: #777;
          font-size: 14px;
          @include flex(null, center, wrap);
          > div {
            height: 30px;
            padding: 5px 10px;
            line-height: 30px;
            cursor: pointer;
          }
          .choose-item {
            background-color: var(--el-color-success);
            color: #fff;
          }
        }
      }
    }
    .resourceList-button {
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      border: 2px solid #333;
      border-radius: 20px;
      margin-bottom: 40px;
      cursor: pointer;
      > div {
        height: 50px;
        line-height: 50px;
        @include p-number(50px);
      }
    }
    .resourceList-container {
      width: 100%;
      margin-top: 10px;
    }
    .page {
      width: 100%;
      margin: 15px 0px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
