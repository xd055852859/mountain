<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import { ResultProps } from "@/interface/Common";
import { Search } from "@element-plus/icons-vue";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NewsItem from "@/components/newsItem.vue";
import { News } from "@/interface/Circle";
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const { newsTag, newsIndex } = storeToRefs(appStore.tagStore);
const { getTag, setNewsIndex } = appStore.tagStore;
const newsTitle = ref<string>("");
const newsList = ref<News[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);
const getNewsList = async () => {
  let obj: any = {
    articleType: "News",
    title: newsTitle.value,
    page: page.value,
    limit: 30,
  };
  if (page.value === 1) {
    newsList.value = [];
  }
  if (newsIndex.value === 100) {
    obj.tabType = "recommend";
  } else if (newsIndex.value === 101) {
    obj.tabType = "hot";
  } else {
    obj.tagKey = newsTag.value[newsIndex.value]._key;
  }
  const tagRes = (await api.request.get("article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    newsList.value = [...newsList.value, ...tagRes.data];
    total.value = tagRes.total as number;
  }
};
const chooseTag = (index) => {
  setNewsIndex(index);
  console.log(index);
  page.value = 1;
  getNewsList();
};
const scrollNews = (e: any) => {
  //文档内容实际高度（包括超出视窗的溢出部分）
  let scrollHeight = e.target.scrollHeight;
  //滚动条滚动距离
  let scrollTop = e.target.scrollTop;
  //窗口可视范围高度
  let height = e.target.clientHeight;
  if (
    height + scrollTop >= scrollHeight &&
    newsList.value.length < total.value
  ) {
    page.value++;
    getNewsList();
  }
};

const changeNews = (circleItem) => {
  console.log(circleItem);
  let index = newsList.value.findIndex(
    (item: News) => item._key === circleItem._key
  );
  console.log(index);
  if (index !== -1) {
    newsList.value[index] = { ...newsList.value[index], ...circleItem };
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getTag("News");
      getNewsList();
    }
  },
  { immediate: true }
);
watch(newsTitle, (newVal) => {
  if (!newVal) {
    getNewsList();
  }
});
</script>
<template>
  <!-- <el-button type="success" style="width: 100%; height: 40px" @click="postNews"
    >发送新闻</el-button
  > -->
  <pHeader isMenu>
    <template v-slot:title>新闻</template>
  </pHeader>
  <div class="phone-news">
    <div class="input">
      <el-icon>
        <Search />
      </el-icon>
      <el-input
        v-model="newsTitle"
        placeholder="请输入新闻标题"
        style="width: calc(100% - 100px)"       
      />
      <div
        class="input-button"
        @click="
          page = 1;
          getNewsList();
        "
      >
        搜索
      </div>
    </div>
    <div class="tab">
      <div
        class="tab-item icon-point"
        @click="chooseTag(100)"
        :class="{ 'choose-tab': newsIndex === 100 }"
      >
        推荐
      </div>
      <div
        class="tab-item icon-point"
        @click="chooseTag(101)"
        :class="{ 'choose-tab': newsIndex === 101 }"
      >
        热榜
      </div>
      <div
        v-for="(item, index) in newsTag"
        :key="'tag' + index"
        class="tab-item icon-point"
        @click="chooseTag(index)"
        :class="{ 'choose-tab': newsIndex === index }"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="container" @scroll="scrollNews">
      <template v-for="(item, index) in newsList" :key="'news' + index">
        <NewsItem :item="item" @changeItem="changeNews" />
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
.phone-news {
  width: 100%;
  height: calc(100% - 50px);
  @include p-number(15px);
  .input {
    width: 100%;
    height: 40px;
    border: 2px solid #48c064;
    border-radius: 36px;
    overflow: hidden;
    @include flex(space-between, center, null);
    padding: 0px 2px 0px 10px;
    box-sizing: border-box;
    .input-button {
      width: 65px;
      height: 27px;
      background: linear-gradient(90deg, #48c064, #6fcd53);
      border-radius: 34px;
      border: 3px solid transparent;
      color: #fff;
      text-align: center;
      line-height: 27px;
      cursor: pointer;
    }
  }
  .tab {
    // width: 100%;
    height: 40px;
    margin: 15px 0px 5px 0px;
    @include flex(null, center, null);
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .tab-item {
      flex-shrink: 0;
      padding: 0px 10px;
      cursor: pointer;
      @include flex(center, center, null);
    }
    .choose-tab {
      color: var(--el-color-success);
      font-size: 18px;
      border-bottom: 2px solid var(--el-color-success);
    }
  }
  .container {
    width: 100%;
    height: calc(100% - 110px);
    @include scroll();
  }
}
</style>
<style lang="scss">
.phone-news {
  .input {
    .el-input__wrapper {
      border-radius: 0;
      box-shadow: none;
      padding: 1px 0px;
    }
    .is-focus {
      box-shadow: none;
    }
  }
}
</style>
