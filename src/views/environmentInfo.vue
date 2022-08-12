<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { EnvironmentInfo } from "@/interface/Resource";
import CommentItem from "../components/commentItem.vue";
import CommonMap from "@/components/commonMap.vue";
const { domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const route = useRoute();
const environmentKey = ref<string>("");
const environmentInfo = ref<EnvironmentInfo | null>(null);
const pointArray = ref<{ lnglat: string[]; regionCode: number }[]>([]);
const getEnvironmentInfo = async () => {
  environmentKey.value = route.params.id as string;
  const environmentRes = (await api.request.get("event/detail", {
    eventKey: environmentKey.value,
  })) as ResultProps;
  if (environmentRes.msg === "OK") {
    environmentInfo.value = { ...environmentRes.data };
    if (
      environmentInfo.value?.location &&
      environmentInfo.value.location.length > 0
    ) {
      pointArray.value.push({
        lnglat: [
          environmentInfo.value.location[0] + "",
          environmentInfo.value.location[1] + "",
        ],
        regionCode: environmentInfo.value.regionCode,
      });
    }
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getEnvironmentInfo();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>环情上报详情</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="environmentInfo"
    :style="
      deviceType === 'computer'
        ? {
            marginTop: '50px',
            height: `calc(100vh - 50px)`,
            overflowX: 'hidden',
            overflowY: 'auto',
          }
        : { height: `calc(100vh - 60px)` }
    "
  >
    <template v-if="environmentInfo">
      <div
        class="environmentInfo-container"
        :style="
          deviceType === 'phone'
            ? {
                width: '100%',
                height: `calc(100vh - 115px)`,
                overflowX: 'hidden',
                overflowY: 'auto',
              }
            : {
                width: '85vw',
                minWidth: '650px',
                maxWidth: '1600px',
                // height: newsInfo.tagInfo?.allowComment
                //   ? `calc(100vh - 175px)`
                //   : `calc(100vh - 120px)`,
              }
        "
      >
        <div
          class="environmentInfo-nav"
          :style="
            deviceType === 'phone'
              ? { width: '100%' }
              : { width: '85vw', minWidth: '650px' }
          "
        >
          <div>
            <div class="title">位置: {{ environmentInfo.title }}</div>
            <div>类型: {{ environmentInfo.tagInfo.name }}</div>
            <div>{{ environmentInfo.describe }}</div>
            <div>
              <div
                v-for="imgItem in environmentInfo.imageList"
                class="environmentInfo-img"
              >
                <img :src="imgItem" alt="" />
              </div>
            </div>
          </div>
          <CommonMap
            :mapId="'infoMap'"
            :width="deviceType === 'computer' ? '85vw' : `calc(100vw - 30px)`"
            :height="'300px'"
            :pointArray="pointArray"
            v-if="pointArray.length > 0"
          />
        </div>

        <el-divider />
        <div class="name">管理员回复</div>
        <div class="reply">
          <div
            class="comment-item"
            v-for="(item, index) in environmentInfo.replyList"
          >
            <comment-item :item="item" />
            <!-- <div
            @click="
              deleteIndex = index;
              delVisible = true;
            "
            class="del-button icon-point"
          >
            <el-icon><Delete /></el-icon>
          </div>
          <icon-font class="icon-point del-button" name="delete" :size="20" /> -->
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.environmentInfo {
  width: 100%;
  height: calc(100vh - 60px);
  @include p-number(15px);
  @include flex(center, null, wrap);
  // @include flex(center, null, flex);
  .environmentInfo-container {
    .environmentInfo-nav {
      width: 100%;
      margin-bottom: 20px;
      > div {
        width: 100%;
        min-height: 35px;
        line-height: 35px;
        color: #999;
        margin-bottom: 15px;
      }
      .title {
        font-size: 20px;
        font-weight: 400;
        margin: 10px 0px;
        color: #333;
      }
    }
    .environmentInfo-img {
      width: 60px;
      height: 60px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .name {
      width: 100%;
    }
    .reply {
      width: 100%;
    }
  }
}
</style>
<style></style>
