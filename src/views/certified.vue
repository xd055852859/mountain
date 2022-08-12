<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const router = useRouter();
const mobile = ref<string>("");
const IDCard = ref<string>("");
const trueName = ref<string>("");
function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    alert("身份证输入不合法");
    return false;
  }
}
const postCertified = async () => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(IDCard.value)) {
    ElMessage({
      message: `请输入正确的身份证号码`,
      type: "error",
      duration: 1000,
    });
    return;
  }
  const postTagRes = (await api.request.post("user/certified", {
    IDCard: IDCard.value,
    trueName: trueName.value,
  })) as ResultProps;
  if (postTagRes.msg === "OK") {
    ElMessage({
      message: `实名认证成功`,
      type: "success",
      duration: 1000,
    });
    //@ts-ignore
    setUserInfo({
      ...user.value,
      certified: true,
    });
    router.back();
  }
};
watch(
  user,
  (newVal) => {
    if (newVal) {
      mobile.value = newVal.mobile as string;
      trueName.value = newVal.userName as string;
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>认证当前用户 </template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="certified"
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
      class="certified-info"
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
      <div>手机号</div>
      <div>
        <el-input
          v-model="mobile"
          placeholder="请输入手机号"
          style="width: 100%"
          type="number"
          disabled
        />
      </div>
      <div>身份证</div>
      <div>
        <el-input
          v-model="IDCard"
          placeholder="请输入身份证"
          style="width: 100%"
        />
      </div>
      <div>真实姓名</div>
      <div>
        <el-input
          v-model="trueName"
          placeholder="请输入真实姓名"
          style="width: 100%"
        />
      </div>
      <div class="tip">请保证所留下手机号和身份证是同一人</div>
      <div class="tip">服务人员将会通过此手机号找到您</div>
      <div class="certified-button">
        <el-button
          type="success"
          :style="
            deviceType === 'phone'
              ? { width: '100%', height: '40px' }
              : { width: '350px', height: '40px' }
          "
          @click="postCertified"
          >提交认证</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.certified {
  @include flex(center, center, wrap);
  .certified-info {
    @include p-number(15px);
    > div {
      width: 100%;
      height: 50px;
      margin-bottom: 2.5vh;
      line-height: 50px;
    }
    .tip {
      width: 100%;
      height: 30px;
      font-size: 14px;
      margin-bottom: 0px;
      color: #999;
      line-height: 30px;
    }
    .certified-button {
      width: 100%;
      margin-top: 2.5vh;
      @include p-number(15px);
      @include flex(center, null, null);
    }
  }
}
</style>
<style></style>
