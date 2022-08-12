<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import Avatar from "@/components/avatar.vue";
import { Delete, ChatLineRound } from "@element-plus/icons-vue";
import { News } from "@/interface/Circle";
import { ResultProps, Comment } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import CommentItem from "../components/commentItem.vue";
import Editor from "@/components/editor/editor.vue";
const route = useRoute();
const dayjs: any = inject("dayjs");
const { token, user, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const replyInput = ref<string>("");
const newsInfo = ref<News | null>(null);
const commentList = ref<Comment[]>([]);
const deleteIndex = ref<number>(0);
const delVisible = ref<boolean>(false);
const getNewsInfo = async () => {
  const circleRes = (await api.request.get("article/detail", {
    articleKey: route.params.id,
  })) as ResultProps;
  if (circleRes.msg === "OK") {
    newsInfo.value = { ...circleRes.data };
    if (newsInfo.value) {
      newsInfo.value.content.splice(0, 1);
    }
    if (newsInfo.value?.commentList) {
      commentList.value = [...newsInfo.value.commentList];
    }
  }
};
const postReply = async () => {
  if (!replyInput.value) {
    ElMessage({
      message: "请输入回复内容",
      type: "error",
      duration: 1000,
    });
    return;
  }
  const replyRes = (await api.request.post("comment", {
    articleKey: route.params.id,
    content: replyInput.value,
  })) as ResultProps;
  if (replyRes.msg === "OK") {
    ElMessage({
      message: "回复成功",
      type: "success",
      duration: 1000,
    });
    replyInput.value = "";
    commentList.value.unshift(replyRes.data);
  }
};
const addReply = (item: Comment) => {
  commentList.value.unshift(item);
};
const delReply = (key: string) => {
  commentList.value = commentList.value.filter((item) => item._key !== key);
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getNewsInfo();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>新闻详情</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="newsInfo"
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
    <div
      class="newsInfo-container"
      v-if="newsInfo"
      :style="
        deviceType === 'phone'
          ? {
              width: '100%',
              height: newsInfo.tagInfo?.allowComment
                ? `calc(100vh - 145px)`
                : `calc(100vh - 100px)`,
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
      <div class="info-nav" v-if="deviceType === 'computer'">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/computer/news' }"
            >新闻中心</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/computer/news' }">{{
            newsInfo.tagInfo.name
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            newsInfo.title
              ? newsInfo.title.length > 6
                ? newsInfo.title.substring(0, 5)
                : newsInfo.title
              : "圈子详情"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="info">
        <div class="title">{{ newsInfo.title }}</div>
        <div class="time">
          {{ dayjs(newsInfo.createTime).format("YYYY-M-D HH:mm") }} · 阅读:
          {{ newsInfo.viewNum }}
        </div>
        <el-divider border-style="dashed" />
        <Editor :init-data="newsInfo.content" />
      </div>
      <template v-if="newsInfo.tagInfo?.allowComment">
        <el-divider border-style="dashed" />
        <div class="title">
          <el-icon style="margin-right: 5px"><ChatLineRound /></el-icon
          >{{ commentList.length }}评论
        </div>
        <div
          class="reply-input"
          v-if="
            deviceType === 'computer' &&
            newsInfo?.tagInfo?.allowComment &&
            token
          "
        >
          <avatar
            :name="user?.userName"
            :avatar="user?.userAvatar"
            type="person"
            :index="0"
            :size="40"
            :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
          />
          <div class="reply-input-right">
            <el-input
              v-model="replyInput"
              :autosize="{ minRows: 8 }"
              type="textarea"
              placeholder="请输入内容"
              autofocus
              style="width: 100%"
            />
            <div class="reply-input-button">
              <el-button type="success" @click="postReply">回复</el-button>
            </div>
          </div>
        </div>
        <div class="reply">
          <div class="comment-item" v-for="(item, index) in commentList">
            <comment-item
              :item="item"
              :infoId="($route.params.id as string)"
              type="news"
              @addComment="addReply"
              @deleteComment="delReply"
            />
          </div>
        </div>
      </template>
    </div>

    <div
      class="newsInfo-input"
      v-if="deviceType === 'phone' && newsInfo?.tagInfo?.allowComment && user"
    >
      <el-divider />
      <el-input
        v-model="replyInput"
        placeholder="我来说一说"
        @change="postReply"
      />
    </div>
  </div>
  <!-- <el-dialog v-model="delVisible" title="删除评论" width="350px">
    <span>是否删除该评论</span>
    <template #footer>
      <span class="dialog-footer dp-space-center">
        <el-button type="info" @click="delVisible = false" link>取消</el-button>
        <el-button type="success" @click="deleteReply()">确认</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>
<style scoped lang="scss">
.newsInfo {
  width: 100%;
  @include flex(center, null, wrap);
  .newsInfo-container {
    width: 100%;
    @include p-number(15px);

    .info {
      .title {
        font-size: 24px;
        margin-bottom: 10px;
      }
      .time {
        font-size: 14px;
        color: #9c9c9c;
      }
    }
    .title {
      // margin-bottom: 10px;
      @include flex(null, center, null);
      font-size: 14px;
      font-weight: 400;
    }
    .reply-input {
      margin: 15px 0px;
      position: relative;
      z-index: 1;
      @include flex(space-between, null, null);
      .reply-input-right {
        width: calc(100% - 60px);
        height: 100%;
      }
      .reply-input-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 2;
      }
    }
    .reply {
      margin-bottom: 20px;
      .comment-item {
        position: relative;
        z-index: 1;
      }
      .del-button {
        bottom: 0px;
        right: 10px;
        position: absolute;
        z-index: 2;
      }
    }
  }
  .newsInfo-input {
    width: 100%;
    height: 60px;
    @include p-number(15px);
    @include flex(center, center, wrap);
  }
}
</style>
<style lang="scss"></style>
