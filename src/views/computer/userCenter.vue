<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import ResourceItem from "@/components/resourceItem.vue";
import Avatar from "@/components/avatar.vue";
import api from "@/services/api";
import { storeToRefs } from "pinia";
import { ResultProps } from "@/interface/Common";
import { Resource } from "@/interface/Resource";
const { user, domain } = storeToRefs(appStore.authStore);
const reportType = ref<number>(1);
const reportList = ref<Resource[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getUserReport = async () => {
  const reportRes = (await api.request.get("user/resource", {
    type: reportType.value,
    page: page.value,
    limit: 8,
  })) as ResultProps;
  if (reportRes.msg === "OK") {
    reportList.value = [...reportRes.data];
    total.value = reportRes.total as number;
    console.log(reportList.value);
  }
};
const deleteReport = (key) => {
  let index = reportList.value.findIndex((item: Resource) => item._key === key);
  if (index !== -1) {
    reportList.value.splice(index, 1);
  }
};
const chooseSelect = (key: string) => {
  reportType.value = parseInt(key);
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
watch(reportType, () => {
  getUserReport();
});
</script>
<template>
  <!-- <cHeader singleHeader :singleNumber="4">
    <template v-slot:nav>
      <div
        @click="
          reportType = 1;
          getUserReport();
        "
        :class="{ 'choose-nav': reportType === 1 }"
      >
        我的资源
      </div>
      <div
        @click="
          reportType = 2;
          getUserReport();
        "
        :class="{ 'choose-nav': reportType === 2 }"
      >
        资源意向
      </div>
      <div
        @click="
          reportType = 3;
          getUserReport();
        "
        :class="{ 'choose-nav': reportType === 3 }"
      >
        资源参拍
      </div>
      <div
        @click="
          reportType = 4;
          getUserReport();
        "
        :class="{ 'choose-nav': reportType === 4 }"
      >
        劳务报名
      </div>
    </template>
  </cHeader> -->
  <div class="computer-userCenter">
    <div class="userCenter-box">
      <div class="userCenter-info">
        <div class="left">
          <div class="user-top-avatar" @click="$router.push('/userEdit')">
            <avatar
              :name="user?.userName"
              :avatar="user?.userAvatar"
              type="person"
              :index="0"
              :size="150"
              :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
            />
            <iconpark-icon name="edit" class="user-top-edit" size="30" />
          </div>
        </div>
        <div class="right">
          <div>{{ user?.userName }}</div>
          <div>{{ user?.mobile }}</div>
          <el-button
            v-if="!user?.certified"
            style="margin-top: 20px"
            type="success"
            @click="$router.push('/certified')"
            >实名制认证</el-button
          >
        </div>
      </div>
      <el-menu
        :default-active="'1'"
        mode="horizontal"
        @select="chooseSelect"
        :ellipsis="false"
      >
        <el-menu-item index="1">我的资源</el-menu-item>
        <el-menu-item index="2">资源意向</el-menu-item>
        <el-menu-item index="3">资源参拍</el-menu-item>
        <el-menu-item index="4">劳务报名</el-menu-item>
      </el-menu>
      <div class="resourceList-container common-box">
        <div
          class="common-info"
          v-for="(item, index) in reportList"
          :key="'resourceList' + index"
        >
          <resource-Item
            :item="item"
            :tabType="reportType === 2 ? 1 : reportType"
            v-if="item"
            @deleteItem="deleteReport"
            type="mine"
          />
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
              getUserReport();
            }
          "
          :page-size="8"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-userCenter {
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f5f5f5;
  @include scroll();
  @include flex(center, null, wrap);
  .userCenter-box {
    width: 85vw;
    min-width: 650px;
  }
  .userCenter-info {
    margin: 40px 0px;
    @include flex(null, center, null);
    .left {
      margin-right: 15px;
      .user-top-avatar {
        position: relative;
        z-index: 1;
        cursor: pointer;
        .user-top-edit {
          position: absolute;
          bottom: 0px;
          right: 10px;
          z-index: 2;
        }
      }
    }
    .right {
      font-size: 20px;
      > div:nth-child(1) {
        margin-bottom: 10px;
      }
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
</style>
<style lang="scss">
.userCenter-box {
  .el-menu {
    background-color: transparent;
  }
}
</style>
