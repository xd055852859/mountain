<script setup lang="ts">
import { News } from "@/interface/Circle";
import { ElMessage } from "element-plus";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const dayjs: any = inject("dayjs");
const props = defineProps<{
  item: News;
}>();
const emits = defineEmits<{
  (e: "changeItem", item: any): void;
}>();
const setFavor = async (e, favor: boolean) => {
  e.stopPropagation();
  const replyRes = (await api.request.post("favor", {
    articleKey: props.item._key,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    ElMessage({
      message: favor ? "点赞成功" : "取消点赞成功",
      type: "success",
      duration: 1000,
    });
    emits("changeItem", { _key: props.item._key, hasFavor: favor });
  }
};
</script>
<template>
  <div class="news-item" @click="$router.push(`/newsInfo/${item._key}`)">
    <div class="left">
      <div class="img">
        <img :src="item.cover" alt="" v-if="item.cover" />
        <el-empty
          description="暂无图片"
          :image-size="60"
          v-else
          :style="deviceType === 'phone' ? { padding: '0px' } : {}"
        />
      </div>
    </div>
    <div class="right">
      <div class="title single-to-long">{{ item.title }}</div>
      <div class="summary">{{ item.summary }}</div>
      <div class="button">
        <div>{{ dayjs(item.createTime).fromNow() }}</div>
        <div class="dp--center">
          <template v-if="user">
            <iconpark-icon
              name="likeFilled"
              style="margin-right: 8px"
              v-if="item.hasFavor"
              @click="setFavor($event, false)"
            />
            <iconpark-icon
              name="like"
              style="margin-right: 8px"
              v-else
              @click="setFavor($event, true)"
            />
          </template>
          <iconpark-icon name="eye" style="margin-right: 8px" />{{
            item.viewNum
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.news-item {
  width: 100%;
  margin-top: 15px;
  background-color: #fff;
  @include flex(space-between, center, null);
  @include itemWidth(var(--mountain-item-width));
  .left {
    height: 100%;
    margin-right: 10px;
  }
  .right {
    width: calc(100% - 130px);
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    flex: 1;
    .title {
    }
    .summary {
      color: #9c9c9c;
      font-size: 14px;
      margin: 10px 0px;
      @include more-toLong(var(--mountain-item-line));
    }
    .button {
      color: #9c9c9c;
      font-size: 14px;
      @include flex(space-between, center, null);
    }
  }
}
</style>
<style lang="scss"></style>
