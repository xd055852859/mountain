<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { Delete } from "@element-plus/icons-vue";
import { StarFilled } from "@element-plus/icons-vue";
import { useThrottleFn } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { user, token } = storeToRefs(appStore.authStore);
const { deviceWidth } = storeToRefs(appStore.commonStore);

const props = defineProps<{
  item: any;
  tabType: number;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "deleteItem", key: string): void;
}>();

const dayjs: any = inject("dayjs");
const delVisible = ref<boolean>(false);
const showType = ref<string>("oneLine");
const itemRef = ref<any>(null);
onMounted(() => {
  showType.value = itemRef.value.offsetWidth > 400 ? "oneLine" : "twoLine";
});
const deleteResource = async () => {
  const resourceRes = (await api.request.delete("resource", {
    resourceKey: props.item._key,
  })) as ResultProps;
  if (resourceRes.msg === "OK") {
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    emits("deleteItem", props.item._key);
  }
};
watch(
  deviceWidth,
  useThrottleFn(() => {
    if (itemRef.value) {
      showType.value = itemRef.value.offsetWidth > 400 ? "oneLine" : "twoLine";
    }
  }, 1000)
);
</script>
<template>
  <div
    class="resource-item"
    ref="itemRef"
    @click="
      $router.push({
        name: 'resourceInfo',
        params: {
          resourceKey: item._key,
          tabType: tabType,
        },
      })
    "
    :style="
      showType === 'oneLine' ? { height: '170px' } : { minHeight: '180px' }
    "
  >
    <!-- deviceType === 'phone' || type === 'home' -->
    <!-- v-if="
        (item.imageList &&
          item.imageList.length > 0 &&
          deviceType === 'phone') ||
        deviceType === 'computer'
      " -->
    <div
      class="left"
      :style="
        showType === 'oneLine'
          ? { width: '170px', height: '100%' }
          : { width: '100%', height: '200px' }
      "
    >
      <div
        class="img"
        :style="
          showType === 'oneLine'
            ? { width: '170px', height: '170px' }
            : { width: '100%', height: '200px' }
        "
      >
        <img
          :src="item.imageList[0]"
          alt=""
          v-if="item.imageList && item.imageList.length > 0"
        />
        <el-empty description="暂无图片" :image-size="60" v-else />
      </div>
    </div>
    <div class="right">
      <div class="name">{{ item.name }}</div>
      <template v-if="tabType !== 3">
        <div class="dp-space-center">
          <div>总面积 {{ item.area }}{{ item.tagInfo?.unit }}</div>
          <div
            v-if="
              item.regionArr && item.regionArr[item.regionArr.length - 1]?.name
            "
          >
            {{ item.regionArr[item.regionArr.length - 1].name.split("（")[0] }}
          </div>
        </div>
        <!-- <div v-if="tabType === 3">项目预算: {{ item.offer }}</div> -->

        <div class="dp--center">
          星级
          <el-icon v-for="starItem in item.star" style="margin-left: 10px"
            ><StarFilled color="#F5A623"
          /></el-icon>
        </div>
      </template>
      <div v-else>项目类型: {{ item.tagInfo?.name }}</div>
      <div
        v-if="tabType === 1"
        style="color: #e95151; font-size: 18px"
        class="status"
        :style="{
          justifyContent: showType === 'oneLine' ? 'flex-start' : 'flex-end',
        }"
      >
        {{
          item.rentOfYear >= 10000
            ? (item.rentOfYear / 10000).toFixed(2) + "万元"
            : item.rentOfYear + "元"
        }}
        <!-- / {{ item.depositTime }} -->
      </div>
      <template v-if="tabType !== 1">
        <div
          class="status"
          :style="{
            justifyContent: showType === 'oneLine' ? 'flex-start' : 'flex-end',
          }"
        >
          {{ showType === "oneLine" ? "状态 : " : "" }}
          <span
            style="
              font-weight: 400;
              font-size: 18px;
              color: #333;
              margin-left: 5px;
            "
            >{{
              dayjs(item.offerEndTime).valueOf() > dayjs().valueOf()
                ? " 报价中"
                : " 已结束"
            }}</span
          >
        </div>
        <div>
          {{ dayjs(item.offerEndTime).format("YYYY年M月D日 HH:mm") }} 竞拍结束
        </div>
      </template>
      <div
        class="button"
        v-if="tabType === 3 && type === 'mine' && item.status === 0"
      >
        <el-icon
          @click="
            $event.stopPropagation();
            delVisible = true;
          "
          ><Delete
        /></el-icon>
      </div>
    </div>
    <!-- <div class="resource-icon-button"> -->
    <div
      v-if="item.uploadUser !== user?._key && type === 'mine'"
      class="resource-icon1"
    >
      他人
    </div>
    <div v-if="!item.status && type === 'mine'" class="wrap">
      <div class="resource-icon2">未上架</div>
    </div>
    <!-- </div> -->
  </div>
  <el-dialog v-model="delVisible" title="删除圈子" width="350px">
    <span>是否删除该圈子</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteResource()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.resource-item {
  width: 100%;
  margin-bottom: 10px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  @include flex(space-between, center, wrap);

  &:hover {
    box-shadow: 0px 4px 9px 0px rgba(178, 178, 178, 0.5);
  }
  .left {
    height: 100%;
    @include flex(center, center, null);
    .img {
      overflow: hidden;
      @include flex(center, center, null);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .right {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    flex: 1;
    @include flex(flex-start, center, wrap);
    > div {
      width: 100%;
      font-size: 14px;
      color: #777;
      height: 26px;
      line-height: 26px;
    }
    .name {
      font-size: 18px;
      color: #333;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;
    }
    .status {
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
    }
    .button {
      @include flex(flex-end, center, null);
    }
  }
  // .resource-icon-button {
  //   position: absolute;
  //   top: 0px;
  //   right: 0px;
  //   z-index: 2;
  //   color: #fff;
  //   @include flex(space-between, center, wrap);
  // .resource-icon {
  //   width: 60px;
  //   height: 35px;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   position: absolute;
  //   top: 0px;
  //   right: 0px;
  //   z-index: 2;
  //   @include flex(center, center, wrap);
  //   border-bottom-left-radius: 10px;
  //   border-bottom-right-radius: 10px;
  // }
  .resource-icon1 {
    display: inline-block;
    position: absolute;
    width: 50px;
    height: 36px;
    line-height: 36px;
    padding-left: 15px;
    color: #fff;
    background: #409eff;
    left: -8px;
    top: 7px;
  }
  .resource-icon1:before,
  .resource-icon1:after {
    content: "";
    position: absolute;
  }
  .resource-icon1:before {
    height: 0;
    width: 0;
    border-bottom: 8px solid black;
    border-left: 8px solid transparent;
    top: -8px;
    left: 0;
  }
  .resource-icon1:after {
    height: 0;
    width: 0;
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    border-left: 15px solid #409eff;
    right: -15px;
  }
  .wrap {
    width: 100%;
    height: 188px;
    position: absolute;
    top: -8px;
    left: 8px;
    overflow: hidden;
    zoom: 0.7;
  }
  .wrap:before {
    content: "";
    display: block;
    border-radius: 8px 8px 0px 0px;
    width: 40px;
    height: 8px;
    position: absolute;
    right: 100px;
    background: #4d6530;
  }
  .wrap:after {
    content: "";
    display: block;
    border-radius: 0px 8px 8px 0px;
    width: 8px;
    height: 40px;
    position: absolute;
    right: 0px;
    top: 100px;
    background: #4d6530;
  }
  .resource-icon2 {
    color: #fff;
    display: inline-block;
    text-align: center;
    width: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    position: absolute;
    top: 30px;
    right: -50px;
    z-index: 2;
    overflow: hidden;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    border: 1px dashed;
    box-shadow: 0 0 0 3px #57dd43, 0px 21px 5px -18px rgba(0, 0, 0, 0.6);
    background: #57dd43;
  }
}
</style>
<style></style>
