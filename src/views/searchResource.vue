<script setup lang="ts">
import appStore from "@/store";
import api from "@/services/api";
import cHeader from "@/components/computer/cHeader.vue";
import { ArrowRight } from "@element-plus/icons-vue";
import ResourceItem from "@/components/resourceItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { ResultProps } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const resourceList = ref<Resource[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const tabType = ref<number>(1);
const searchName = ref<string>("");
const tabArray = ["资源", "报价", "项目"];
onMounted(() => {
  if (route.params.tabType) {
    tabType.value = +route.params.tabType;
  }
  if (route.params.searchName) {
    searchName.value = route.params.searchName as string;
  }
});
const getResourceList = async () => {
  const resourceRes = (await api.request.get("resource", {
    tabType: tabType.value,
    name: searchName.value,
    page: page.value,
    limit: 10,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    resourceList.value = [...resourceRes.data];
    total.value = resourceRes.total as number;
  }
};

watch(
  [domain, searchName],
  ([newDomain, newSearchName]) => {
    if (newDomain && newSearchName) {
      getResourceList();
    }
  },
  { immediate: true }
);
watch(searchName, (newSearchName) => {
  if (!newSearchName) {
    resourceList.value = [];
  }
});
watch(tabType, () => {
  getResourceList();
});
</script>
<template>
  <cHeader />
  <div class="searchResource">
    <div class="searchResource-box">
      <div class="tag">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/computer/home' }"
            ><span>首页</span></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><span style="color: #777">搜索</span></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><el-dropdown>
              <span class="icon-point"> {{ tabArray[tabType - 1] }} </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in tabArray"
                    :key="'tab' + index"
                    @click="tabType = index + 1"
                    >{{ item }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template></el-dropdown
            ></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>

      <div class="input">
        <el-input
          v-model="searchName"
          placeholder="请输入名称"
          style="width: 60vw"
          @change="
            page = 1;
            getResourceList();
          "
        />
      </div>
      <div class="resourceList-container common-box">
        <div
          class="common-info"
          v-for="(item, index) in resourceList"
          :key="'resourceList' + index"
        >
          <resource-Item :item="item" :tabType="tabType" v-if="item" />
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
            :page-size="10"
            hide-on-single-page
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.searchResource {
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  @include flex(center, null, wrap);
  @include scroll();
  .searchResource-box {
    width: 85vw;
    min-width: 650px;
    .tag {
      margin: 40px 0px;
    }
    .input {
      @include flex(center, center, null);
      .el-input__wrapper {
        border-radius: 30px;
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
<style lang="scss">
.searchResource-container {
  .input {
    margin-bottom: 40px;
    .el-input__wrapper {
      border-radius: 30px;
      padding-left: 18px;
      padding-right: 18px;
    }
  }
}
</style>
