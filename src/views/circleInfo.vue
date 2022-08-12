<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import cHeader from "@/components/computer/cHeader.vue";
import Avatar from "@/components/avatar.vue";
import { ChatLineRound } from "@element-plus/icons-vue";
import { Circle } from "@/interface/Circle";
import { ResultProps, Comment } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import CommentItem from "../components/commentItem.vue";
const route = useRoute();
const { token, domain, user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const replyInput = ref<string>("");
const answerInput = ref<string>("");
const circleInfo = ref<Circle | null>(null);
const commentList = ref<Comment[]>([]);

const getCircleInfo = async () => {
  const circleRes = (await api.request.get("article/detail", {
    articleKey: route.params.id,
  })) as ResultProps;
  if (circleRes.msg === "OK") {
    circleInfo.value = { ...circleRes.data };
    if (circleInfo.value?.commentList) {
      commentList.value = [...circleInfo.value.commentList];
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
      getCircleInfo();
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>详情</template>
  </pHeader>
  <cHeader v-if="deviceType === 'computer'" />
  <div
    class="circleInfo"
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
      class="circleInfo-container"
      v-if="circleInfo"
      :style="
        deviceType === 'phone'
          ? {
              width: '100%',
              height: `calc(100vh - 145px)`,
              overflowX: 'hidden',
              overflowY: 'auto',
            }
          : {
              width: '85vw',
              minWidth: '650px',
              maxWidth: '1600px',
            }
      "
    >
      <div class="info-nav" v-if="deviceType === 'computer'">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/computer/circle' }"
            >新闻中心</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/computer/circle' }">{{
            circleInfo.tagInfo.name
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            circleInfo.content
              ? circleInfo.content.length > 6
                ? circleInfo.content.substring(0, 5)
                : circleInfo.content
              : "圈子详情"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="info">
        <div class="left">
          <avatar
            :name="circleInfo.creatorInfo.userName"
            :avatar="circleInfo.creatorInfo.userAvatar"
            type="person"
            :index="0"
            :size="50"
            :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
          />
        </div>
        <div class="right">
          <div class="name">{{ circleInfo.creatorInfo.userName }}</div>
          <div class="detail">{{ circleInfo.content }}</div>
          <template
            v-if="circleInfo.imageList && circleInfo.imageList.length > 0"
          >
            <img
              class="img"
              v-for="(item, index) in circleInfo.imageList"
              :key="'img' + index"
              :src="item"
              alt=""
            />
          </template>
        </div>
      </div>
      <el-divider border-style="dashed" />
      <div class="title">
        <el-icon style="margin-right: 5px"><ChatLineRound /></el-icon
        >{{ commentList.length }}评论
      </div>
      <div class="reply-input" v-if="deviceType === 'computer' && token">
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
            type="circle"
            @addComment="addReply"
            @deleteComment="delReply"
          />
        </div>
      </div>
    </div>
    <div class="circleInfo-input" v-if="deviceType === 'phone' && token">
      <el-divider />
      <el-input
        v-model="replyInput"
        placeholder="说点什么吧"
        @change="postReply"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.circleInfo {
  width: 100%;
  @include flex(center, null, wrap);
  .circleInfo-container {
    width: 100%;
    @include p-number(15px);
    .info {
      width: 100%;
      display: flex;
      align-content: flex-start;
      justify-content: space-between;
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
        }
      }
    }
    .title {
      @include flex(null, center, null);
      font-size: 14px;
      font-weight: 400;
      margin: 15px 0px;
    }
    .reply-input {
      width: 100%;
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
      .comment-item {
        position: relative;
        z-index: 1;
      }
    }
  }
  .circleInfo-input {
    width: 100%;
    height: 60px;
    @include p-number(15px);
    @include flex(center, center, wrap);
  }
}
</style>
<style lang="scss"></style>
