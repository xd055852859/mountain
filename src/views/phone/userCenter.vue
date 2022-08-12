<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import Avatar from "@/components/avatar.vue";
import appStore from "@/store";
import request from "@/services/api";
import { ArrowRight } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import router from "@/router";

const { user } = storeToRefs(appStore.authStore);
const { setToken, setUserInfo } = appStore.authStore;
const logout = () => {
  router.push("/phone/");
  localStorage.removeItem("token");
  request.setToken("");
  setToken("");
  setUserInfo(null);
};
</script>
<template>
  <pHeader isMenu>
    <template v-slot:title>个人中心</template>
  </pHeader>
  <div class="user-center">
    <div class="user-top dp-center-center">
      <div class="user-top-avatar" @click="$router.push('/userEdit')">
        <avatar
          :name="user?.userName"
          :avatar="user?.userAvatar"
          type="person"
          :index="0"
          :size="150"
          :avatarStyle="{ fontSize: '16px' }"
        />
        <iconpark-icon name="edit" class="user-top-edit" size="30" />
      </div>
      <div class="phone">{{ user?.mobile }}</div>
      <el-button
        v-if="!user?.certified"
        type="success"
        @click="$router.push('/certified')"
        >实名制认证</el-button
      >
      <el-button type="success" @click="logout" v-if="user">退出登录</el-button>
    </div>
    <el-divider />
    <div class="user-bottom">
      <div @click="$router.push('/userReport/1')" class="user-bottom-item">
        我的资源 ({{ user?.resourceNum }})<el-icon><ArrowRight /></el-icon>
      </div>
      <div @click="$router.push('/userReport/2')" class="user-bottom-item">
        资源意向 ({{ user?.intentionNum }})<el-icon><ArrowRight /></el-icon>
      </div>
      <div @click="$router.push('/userReport/3')" class="user-bottom-item">
        资源参拍 ({{ user?.rOfferNum }})<el-icon><ArrowRight /></el-icon>
      </div>
      <div @click="$router.push('/userReport/4')" class="user-bottom-item">
        劳务报名 ({{ user?.lOfferNum }})<el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.user-center {
  width: 100%;
  height: calc(100vh - 60px);
  .user-top {
    flex-wrap: wrap;
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
    .phone {
      width: 100%;
      height: 40px;
      margin: 10px 0px;
      text-align: center;
      line-height: 40px;
    }
  }
  .user-bottom {
    .user-bottom-item {
      width: 100%;
      height: 50px;
      @include flex(space-between, center, null);
      @include p-number(15px);
      cursor: pointer;
    }
  }
}
</style>
<style></style>
