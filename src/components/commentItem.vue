<script setup lang="ts">
import Avatar from "@/components/avatar.vue";
import { Comment, ResultProps } from "@/interface/Common";
import { Delete } from "@element-plus/icons-vue";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(appStore.authStore);
const dayjs: any = inject("dayjs");
const props = defineProps<{
  item: Comment;
  infoId?: string;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "deleteComment", key: string): void;
  (e: "addComment", item: Comment): void;
}>();
const answerInput = ref<string>("");
const delVisible = ref<boolean>(false);
const answerVisible = ref<boolean>(false);
const deleteReply = async () => {
  const replyRes = (await api.request.delete("comment", {
    commentKey: props.item._key,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    ElMessage({
      message: "删除成功",
      type: "success",
      duration: 1000,
    });
    emits("deleteComment", props.item._key);
    delVisible.value = false;
  }
};
const answerReply = async () => {
  const replyRes = (await api.request.post("comment", {
    commentId: props.item._key,
    content: answerInput.value,
    articleKey: props.infoId,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    ElMessage({
      message: "回复评论成功",
      type: "success",
      duration: 1000,
    });
    emits("addComment", replyRes.data);
    answerInput.value = "";
    answerVisible.value = false;
  }
};
</script>
<template>
  <div class="comment">
    <div class="left">
      <avatar
        :name="item.creatorInfo.userName"
        :avatar="item.creatorInfo.userAvatar"
        type="person"
        :index="0"
        :size="40"
        :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
      />
    </div>
    <div class="right">
      <div class="name">{{ item.creatorInfo.userName }}</div>
      <div class="comment-reply" v-if="item.targetUserInfo">
        回复<span style="color: #409eff">{{
          item.targetUserInfo.userName
        }}</span
        >:{{ item.targetContent }}
      </div>
      <div class="detail">{{ item.content }}</div>
      <div class="time">{{ dayjs(item.createTime).fromNow() }}</div>
      <div class="del-button">
        <div class="button" @click="answerVisible = true" v-if="type">回复</div>
        <div
          @click="delVisible = true"
          class="icon-point dp-center-center"
          v-if="user?._key === item.creatorInfo._key"
        >
          <el-icon><Delete /></el-icon>
        </div>
      </div>
      <div v-if="answerVisible" class="dp-space-center">
        <el-input v-model="answerInput" placeholder="回复什么吧" style="width:calc(100% - 100px);height:35px;"/>
        <el-button type="success" @click="answerReply()">确认</el-button>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="delVisible"
    title="删除评论"
    width="350px"
    :append-to-body="true"
  >
    <span>是否删除该评论</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteReply()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.comment {
  width: 100%;
  padding: 10px 10px 0px 10px;
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
  margin-bottom:15px;
  .left {
    width: 45px;
    height: 100%;
  }
  .right {
    width: calc(100% - 50px);
    height: 100%;
    position: relative;
    z-index: 1;
    .name {
      font-size: 16px;
      margin-bottom: 5px;
      color: #999;
    }
    .comment-reply {
      background: #f7f7f7;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 5px;
    }
    .detail {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .time {
      font-size: 12px;
      color: #9c9c9c;
      text-align: right;
      position: absolute;
      top: 0px;
      right: 0px;
      z-index: 2;
    }
    .del-button {
      height: 30px;
      @include flex(flex-end, center, null);
      z-index: 2;
      margin-bottom: 5px;
      .button {
        color: #409eff;
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }
}
</style>
<style></style>
