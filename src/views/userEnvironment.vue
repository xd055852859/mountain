<script setup lang="ts">
import appStore from "@/store";
import pHeader from "@/components/phone/pHeader.vue";
import EnvironmentItem from "@/components/environmentItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";
import { Environment } from "@/interface/Resource";
interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const environmentList = ref<Environment[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);

const getEnvironmentList = async () => {
  const resourceRes = (await api.request.get("event/mine", {
    page: page.value,
    limit: 30,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    environmentList.value = [...environmentList.value, ...resourceRes.data];
    total.value = resourceRes.total as number;
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
    environmentList.value.length < total.value
  ) {
    page.value++;
    getEnvironmentList();
  }
};
const deleteEnvironment = (key) => {
  let index = environmentList.value.findIndex(
    (item: Environment) => item._key === key
  );
  if (index !== -1) {
    environmentList.value.splice(index, 1);
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getEnvironmentList();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader>
    <template v-slot:title>我的上报</template>
  </pHeader>
  <div class="environmentList">
    <div class="environmentList-container" @scroll="scrollResourceList">
      <template
        v-for="(item, index) in environmentList"
        :key="'environmentList' + index"
      >
        <environment-Item
          :item="item"
          v-if="item"
          type="mine"
          @deleteItem="deleteEnvironment"
        />
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
