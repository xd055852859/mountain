<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Environment } from "@/interface/Resource";
import api from "@/services/api";
import appStore from "@/store";
import { is_mobile } from "@/services/util";
import { Delete } from "@element-plus/icons-vue";
import { useThrottleFn } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const props = defineProps<{
  item: Environment;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "deleteItem", key: string): void;
}>();
const dayjs: any = inject("dayjs");
const { deviceType, deviceWidth } = storeToRefs(appStore.commonStore);
const { token } = storeToRefs(appStore.authStore);
const delVisible = ref<boolean>(false);
const showType = ref<string>("oneLine");
const itemRef = ref<any>(null);
onMounted(() => {
  showType.value = itemRef.value.offsetWidth > 400 ? "oneLine" : "twoLine";
});
const deleteEnvironment = async () => {
  const environmentRes = (await api.request.delete("event", {
    eventKey: props.item._key,
  })) as ResultProps;
  if (environmentRes.msg === "OK") {
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    emits("deleteItem", props.item._key);
  }
};
const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}#/${deviceType.value}/`
  );
  console.log(redirect);
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=10&apphigh=55&logo=https://workfly.qingtime.cn/1652428088606_workingVip.png&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
  } else {
    window.open(href, "_self");
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
    class="environment-item"
    ref="itemRef"
    @click="token ? $router.push('/environmentInfo/' + item._key) : login()"
    :style="
      showType === 'oneLine' ? { height: '170px' } : { minHeight: '180px' }
    "
  >
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
      <div class="name">位置: {{ item.title }}</div>
      <div>类型: {{ item.tagInfo?.name }}</div>
      <div class="describe">{{ item.describe }}</div>
      <div class="button" v-if="type === 'mine'">
        <el-icon
          @click="
            $event.stopPropagation();
            delVisible = true;
          "
          :size="18"
          ><Delete
        /></el-icon>
      </div>
    </div>
  </div>
  <el-dialog v-model="delVisible" title="删除上报" width="350px">
    <span>是否删除该问题上报</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteEnvironment()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.environment-item {
  width: 100%;
  min-height: 160px;
  margin-bottom: 20px;

  background-color: #fff;
  @include flex(space-between, center, flex);

  &:hover {
    box-shadow: 0px 4px 9px 0px rgba(178, 178, 178, 0.5);
  }
  .left {
    height: 100%;
    .img {
      width: 130px;
      height: 130px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .right {
    flex: 1;
    min-height: 140px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    > div {
      width: 100%;
      font-size: 14px;
      color: #9c9c9c;
      min-height: 22px;
      line-height: 22px;
      margin-bottom: 5px;
    }
    .name {
      font-size: 16px;
      color: #333;
      min-height: 30px;
      line-height: 30px;
    }
    .describe {
      @include more-toLong(3);
    }
    .button {
      position: absolute;
      z-index: 2;
      bottom: 10px;
      right: 10px;
      @include flex(flex-end, center, null);
    }
  }
}
</style>
<style></style>
