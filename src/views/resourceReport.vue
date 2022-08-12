<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ResultProps, Region, Tag } from "@/interface/Common";
import { ResourceInfo } from "@/interface/Resource";
import { uploadImage } from "@/services/util";
import { Plus } from "@element-plus/icons-vue";
import ResourceItem from "@/components/resourceItem.vue";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const dayjs: any = inject("dayjs");
const { uploadToken, domain, user } = storeToRefs(appStore.authStore);
const { getUploadToken } = appStore.authStore;
const { deviceType } = storeToRefs(appStore.commonStore);
const route = useRoute();
const router = useRouter();
const tabType = ref<number>(1);
const resourceKey = ref<string>("");
const memo = ref<string>("");
const offer = ref<number>(0);
const resourceInfo = ref<ResourceInfo | null>(null);
const qualifications = ref<string[]>([]);
const plans = ref<string[]>([]);
const lastTime = ref<string>("");
const computerName = ref<string>("");
const timer = ref<any>(null);
const getResourceInfo = async () => {
  tabType.value = +(localStorage.getItem("tabType") as string);
  resourceKey.value = localStorage.getItem("resourceKey") as string;
  let url = "";
  let obj: any = {};
  if (tabType.value === 3) {
    url = "labour/detail";
    obj.labourKey = resourceKey.value;
  } else {
    url = "resource/detail";
    obj.resourceKey = resourceKey.value;
  }
  const resourceRes = (await api.request.get(url, {
    ...obj,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    resourceInfo.value = { ...resourceRes.data };
    offer.value = resourceRes.data.offer;
    if (
      resourceInfo.value &&
      resourceInfo.value.offerEndTime > dayjs().valueOf()
    ) {
      lastTime.value = formatTime(
        dayjs(resourceInfo.value.offerEndTime).valueOf() - dayjs().valueOf()
      );
      timer.value = setInterval(() => {
        if (
          resourceInfo.value &&
          resourceInfo.value.offerEndTime > dayjs().valueOf()
        ) {
          lastTime.value = formatTime(
            dayjs(resourceInfo.value.offerEndTime).valueOf() - dayjs().valueOf()
          );
        } else {
          lastTime.value = "已结束";
          clearInterval(timer.value);
        }
      }, 60000);
    } else {
      lastTime.value = "已结束";
    }
  }
};
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
const formatTime = (millisecond: number) => {
  var days = parseInt(millisecond / (1000 * 60 * 60 * 24) + "");
  var hours = parseInt(
    (millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + ""
  );
  var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60) + "");
  console.log(days);
  return `${days > 0 ? `${days}天` : ""}${hours > 0 ? `${hours}小时` : ""}${
    minutes > 0 ? `${minutes}分钟` : ""
  }`;
};
const postLabourReport = async () => {
  const resourceRes = (await api.request.post("labourOffer", {
    labourKey: resourceKey.value,
    memo: memo.value,
    offer: offer.value,
    qualifications: qualifications.value,
    plans: plans.value,
    company: computerName.value,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    ElMessage({
      message: `提交劳务报价成功`,
      type: "success",
      duration: 1000,
    });
    router.back();
  }
};
const postResourceReport = async () => {
  const resourceRes = (await api.request.post("resourceOffer", {
    resourceKey: resourceKey.value,
    memo: memo.value,
    offer: offer.value,
    offerType: tabType.value === 1 ? "intention" : "offer",
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    ElMessage({
      message: `提交${tabType.value === 1 ? "意向" : "报价"}成功`,
      type: "success",
      duration: 1000,
    });
    router.back();
  }
};
const updateImg = (file, type) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  for (let i = 0; i < file.length; i++) {
    uploadImage(file[i], uploadToken.value, mimeType, (url: string) => {
      if (type === "qualifications") {
        qualifications.value.push(url);
      } else {
        plans.value.push(url);
      }
    });
  }
};
const delImg = (index, type) => {
  if (type === "qualifications") {
    qualifications.value.splice(index, 1);
  } else {
    plans.value.splice(index, 1);
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getUploadToken();
      getResourceInfo();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>{{
      tabType === 1
        ? "项目意向填写"
        : tabType === 2
        ? "项目报价填写"
        : "项目劳务填写"
    }}</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="resourceReport"
    v-if="resourceInfo"
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
      class="resourceReport-container"
      :style="
        deviceType === 'phone'
          ? {
              width: '100%',
              height: `calc(100vh - 145px)`,
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
      <resource-Item
        :item="resourceInfo"
        :tabType="tabType"
        v-if="tabType !== 3"
      />
      <div v-else class="resourceReport-input">
        <div>
          剩余报价时间 :
          <div
            style="color: #e95151; font-size: 20px; margin-left: 10px; flex: 1"
          >
            {{ lastTime }}
          </div>
        </div>
        <div>我的报价</div>
        <div>
          <el-input
            v-model="offer"
            placeholder="请输入你的报价"
            style="width: calc(100% - 40px); margin-right: 10px"
            type="number"
          />元
        </div>
      </div>
      <div class="resourceReport-info" v-if="tabType !== 2">
        <div>
          <span>姓名</span>
          <div>{{ user?.userName }}</div>
        </div>
        <div>
          <span>手机号</span>
          <div>{{ user?.mobile }}</div>
        </div>
        <div v-if="tabType === 3">
          <span>公司名</span>
          <div>
            <el-input
              v-model="computerName"
              placeholder="请输入你的公司名"
              style="width: 100%"
            />
          </div>
        </div>
        <template v-if="tabType === 1">
          <div>
            <div class="form-title">备注</div>
            <el-input
              v-model="memo"
              :autosize="{ minRows: 8 }"
              type="textarea"
              placeholder="范例：我有投资意向，愿意出资或合作开发"
              style="width: 100%"
            />
          </div>
        </template>

        <template v-if="tabType === 3">
          <div>
            <div class="form-title">资质证明</div>
            <div class="form-upload">
              <div class="upload dp--center">
                <div
                  class="upload-img"
                  v-for="(item, index) in qualifications"
                  :key="'img' + index"
                >
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="item"
                    :preview-src-list="qualifications"
                    :initial-index="index"
                    fit="cover"
                    :hide-on-click-modal="true"
                    :preview-teleported="true"
                  />
                  <div class="upload-delete">
                    <icon-font
                      name="close"
                      :size="22"
                      class="icon-point"
                      @click.stop="delImg(index, 'qualifications')"
                    />
                  </div>
                </div>
                <div class="upload-button dp-center-center icon-point">
                  <el-icon><plus /></el-icon>
                  <input
                    type="file"
                    accept="image/*"
                    @change="
                      //@ts-ignore
                      updateImg($event.target.files, 'qualifications')
                    "
                    class="upload-button-img"
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="form-title">项目方案</div>
            <div class="form-upload">
              <div class="upload dp--center">
                <div
                  class="upload-img"
                  v-for="(item, index) in plans"
                  :key="'img' + index"
                >
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="item"
                    :preview-src-list="plans"
                    :initial-index="index"
                    fit="cover"
                    :hide-on-click-modal="true"
                    :preview-teleported="true"
                  />
                  <div class="upload-delete">
                    <icon-font
                      name="close"
                      :size="22"
                      class="icon-point"
                      @click.stop="delImg(index, 'plans')"
                    />
                  </div>
                </div>
                <div class="upload-button dp-center-center icon-point">
                  <el-icon><plus /></el-icon>
                  <input
                    type="file"
                    accept="image/*"
                    @change="
                      //@ts-ignore
                      updateImg($event.target.files, 'plans')
                    "
                    class="upload-button-img"
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="resourceReport-info" v-else>
        <div>
          剩余报价时间 :
          <div
            style="color: #e95151; font-size: 20px; margin-left: 10px; flex: 1"
          >
            {{ lastTime }}
          </div>
        </div>
        <div>我的报价</div>
        <div>
          <el-input
            v-model="offer"
            placeholder="请输入你的报价"
            style="width: calc(100% - 40px); margin-right: 10px"
            type="number"
            :min="resourceInfo.offer"
          />
          元
        </div>
        <template v-if="tabType === 2">
          <div style="color: #999; font-size: 14px; line-height: 30px">
            *
            报价后您的姓名、电话号码会被服务人员看到，如果价格合适，服务人员会在所有人报价结束后联系您
          </div>
        </template>
      </div>
      <div class="resourceReport-button">
        <el-button
          type="success"
          :style="
            deviceType === 'phone'
              ? { width: '100%', height: '40px' }
              : { width: '350px', height: '40px' }
          "
          @click="tabType == 3 ? postLabourReport() : postResourceReport()"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.resourceReport {
  width: 100vw;
  height: calc(100vh - 60px);
  align-content: center;
  @include flex(center, null, wrap);
  .resourceReport-input {
    width: 100%;
    // height: 160px;
    > div {
      width: 100%;
      min-height: 30px;
      margin-bottom: 2vh;
    }
  }
  .resourceReport-container {
    @include p-number(15px);
    .resourceReport-info {
      width: 100%;

      margin-bottom: 20px;
      overflow-x: hidden;
      overflow-y: auto;
      > div {
        width: 100%;
        min-height: 40px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 2vh;
        > span {
          width: 100px;
        }
        > div {
          width: calc(100% - 115px);
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .form-title {
          width: 100%;
          justify-content: flex-start;
          margin-top: 5px;
          margin-bottom: 15px;
        }
        .form-upload {
          width: 100%;
          display: block;
        }
      }
    }
    .resourceReport-button {
      width: 100%;
      margin-top: 20px;
      @include p-number(15px);
      @include flex(center, null, null);
    }
  }
}
</style>
<style></style>
