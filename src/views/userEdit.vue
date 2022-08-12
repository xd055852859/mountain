<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ElMessage } from "element-plus";
import appStore from "@/store";
import api from "@/services/api";
import Avatar from "@/components/avatar.vue";
import { storeToRefs } from "pinia";
import { uploadImage } from "@/services/util";
import { ResultProps } from "@/interface/Common";
const { user, uploadToken } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const { setUserInfo, getUploadToken } = appStore.authStore;
const userName = ref<string>("");
const userAvatar = ref<string>("");
const mobile = ref<string>("");
const email = ref<string>("");
const address = ref<string>("");
const company = ref<string>("");
const updateImg = (file) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  if (file) {
    uploadImage(file, uploadToken.value, mimeType, (url: string) => {
      userAvatar.value = url;
      // editorInfo.value?.chain().focus().deleteRange(range).setImage({ src: url });
    });
  }
};
const postEdit = async () => {
  const editRes = (await api.request.patch("user/config", {
    userName: userName.value,
    userAvatar: userAvatar.value,
    mobile: mobile.value,
    email: email.value,
    address: address.value,
    company: company.value,
  })) as ResultProps;
  if (editRes.msg === "OK") {
    ElMessage({
      message: `编辑成功`,
      type: "success",
      duration: 1000,
    });
    //@ts-ignore
    setUserInfo({
      ...user.value,
      userName: userName.value,
      userAvatar: userAvatar.value,
      mobile: mobile.value,
      email: email.value,
      address: address.value,
      company: company.value,
    });
  }
};
watch(
  user,
  (newUser) => {
    getUploadToken();
    if (newUser) {
      userName.value = newUser.userName;
      userAvatar.value = newUser.userAvatar;
      if (newUser.mobile) {
        mobile.value = newUser.mobile;
      }
      if (newUser.email) {
        email.value = newUser.email;
      }
      if (newUser.address) {
        address.value = newUser.address;
      }
      if (newUser.company) {
        company.value = newUser.company;
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>编辑信息 </template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="user-edit"
    :style="
      deviceType === 'computer'
        ? {
            marginTop: '70px',
            height: `calc(100vh - 70px)`,
            overflowX: 'hidden',
            overflowY: 'auto',
          }
        : { height: `calc(100vh - 60px)` }
    "
  >
    <div
      class="user-edit-container"
      :style="
        deviceType === 'phone'
          ? {
              width: '100%',
              height: `calc(100vh - 115px)`,
              overflowX: 'hidden',
              overflowY: 'auto',
            }
          : {
              minHeight: `80vh`,
              width: '85vw',
              minWidth: '650px',
              maxWidth: '1600px',
            }
      "
    >
      <div class="user-top">
        <avatar
          :name="userName"
          :avatar="userAvatar"
          type="person"
          :index="0"
          :size="150"
          :avatarStyle="{ fontSize: '16px' }"
        />
        <div class="user-top-upload upload-box">
          <div class="upload-button icon-point">
            <el-button type="success" @click="">上传头像</el-button>
            <input
              type="file"
              accept="image/*"
              @change="
                //@ts-ignore
                updateImg($event.target.files[0])
              "
              class="upload-button-img"
            />
          </div>
        </div>
      </div>
      <div class="user-bottom">
        <div>
          <span>姓名</span>
          <el-input
            v-model="userName"
            placeholder="请输入手机号"
            style="width: 100%"
          />
        </div>
        <div>
          <span>手机号</span>
          <el-input
            v-model="mobile"
            placeholder="请输入手机号"
            style="width: 100%"
            disabled
          />
        </div>
        <div>
          <span>邮箱</span>
          <el-input
            v-model="email"
            placeholder="请输入邮箱"
            style="width: 100%"
          />
        </div>
        <div>
          <span>地址</span>
          <el-input
            v-model="address"
            placeholder="请输入地址"
            style="width: 100%"
          />
        </div>
        <div>
          <span>单位</span>
          <el-input
            v-model="company"
            placeholder="请输入单位"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="user-edit-button">
        <el-button
          type="success"
          :style="
            deviceType === 'phone'
              ? { width: '100%', height: '40px' }
              : { width: '350px', height: '40px' }
          "
          @click="postEdit()"
          >保存设置</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.user-edit {
  @include flex(center, center, wrap);
  .user-edit-container {
    // @include flex(center, center, wrap);
    .user-top {
      @include flex(center, center, wrap);
      .user-top-upload {
        width: 100%;
        height: 70px;
        @include flex(center, center, null);
      }
    }
    .user-bottom {
      > div {
        width: 100%;
        height: 60px;
        margin-bottom: 2.5vh;
        @include flex(space-between, center, null);
        @include p-number(15px);
        cursor: pointer;
        > span {
          width: 100px;
          height: 60px;
          line-height: 60px;
        }
      }
    }
    .user-edit-button {
      width: 100%;
      margin-top: 30px;
      @include p-number(15px);
      @include flex(center, null, null);
    }
  }
}
</style>
<style></style>
