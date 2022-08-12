<script setup lang="ts">
import { Circle } from "@/interface/Circle";
import { ElMessage } from "element-plus";
import Avatar from "@/components/avatar.vue";
import { Delete } from "@element-plus/icons-vue";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { user } = storeToRefs(appStore.authStore);

const props = defineProps<{
  item: Circle;
}>();
const emits = defineEmits<{
  (e: "deleteItem", key: string): void;
  (e: "changeItem", item: any): void;
}>();
const delVisible = ref<boolean>(false);
const setFavor = async (e,favor: boolean) => {
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
const deleteCircle = async () => {
  const replyRes = (await api.request.delete("article", {
    articleKey: props.item._key,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    delVisible.value = false;
    emits("deleteItem", props.item._key);
  }
};
</script>
<template>
  <div class="circle-item" @click="$router.push(`/circleInfo/${item._key}`)">
    <div class="left">
      <avatar
        :name="item.creatorInfo.userName"
        :avatar="item.creatorInfo.userAvatar"
        type="person"
        :index="0"
        :size="50"
        :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
      />
    </div>
    <div class="right">
      <div class="name">{{ item.creatorInfo.userName }}</div>
      <div class="detail">{{ item.summary }}</div>
      <template v-if="item.imageList && item.imageList.length > 0">
        <div class="img">
          <div
            v-for="(imgItem, imgIndex) in item.imageList"
            :key="'img' + imgItem"
            class="img-item"
          >
            <img :src="imgItem" alt="" />
          </div>
        </div>
      </template>
      <div class="button" v-if="user">
        <iconpark-icon
          name="likeFilled"
          style="margin-right: 8px"
          v-if="item.hasFavor"
          @click="setFavor($event,false)"
        />
        <iconpark-icon
          name="like"
          style="margin-right: 8px"
          v-else
          @click="setFavor($event,true)"
        />

        <el-icon
          @click="
            $event.stopPropagation();
            delVisible = true;
          "
          v-if="item.creatorInfo._key === user?._key"
          ><Delete
        /></el-icon>
      </div>
    </div>
  </div>
  <el-dialog v-model="delVisible" title="删除圈子" width="350px">
    <span>是否删除该圈子</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteCircle()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.circle-item {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  background-color: #fff;
  &:hover {
    box-shadow: 0px 4px 9px 0px rgba(178, 178, 178, 0.5);
  }
  .left {
    width: 55px;
    height: 100%;
  }
  .right {
    width: calc(100% - 60px);
    height: 100%;
    .name {
      font-size: 18px;
      margin-bottom: 10px;
    }
    .detail {
      font-size: 16px;
      margin-bottom: 10px;
      color: #9c9c9c;
    }
    .img {
      width: 100%;
      @include flex(null, null, wrap);
      .img-item {
        width: 80px;
        height: 80px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .button {
      @include flex(flex-end, center, null);
    }
  }
}
</style>
<style></style>
