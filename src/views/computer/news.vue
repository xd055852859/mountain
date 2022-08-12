<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NewsItem from "@/components/newsItem.vue";
import { News } from "@/interface/Circle";
import { onBeforeRouteLeave } from "vue-router";
const route = useRoute();
const { domain } = storeToRefs(appStore.authStore);
const { tabType } = storeToRefs(appStore.commonStore);
const { newsTag } = storeToRefs(appStore.tagStore);
const coverList = computed(() => {
  let arr: string[] = [];
  if (newsList.value.length > 0) {
    newsList.value.slice(0, 6).forEach((item) => {
      if (item.cover) {
        arr.push(item.cover);
      }
    });
    return arr;
  }
});
const newsList = ref<News[]>([]);
const page = ref<number>(1);
const total = ref<number>(0);

onBeforeRouteLeave(() => {
  changeTab();
});
const getNewsList = async () => {
  let obj: any = {
    articleType: "News",
    page: page.value,
    limit: 12,
  };
  if (page.value === 1) {
    newsList.value = [];
  }
  if (tabType.value === 100) {
    obj.tabType = "recommend";
  } else if (tabType.value === 101) {
    obj.tabType = "hot";
  } else {
    obj.tagKey = newsTag.value[tabType.value]._key;
  }
  const tagRes = (await api.request.get("article", { ...obj })) as ResultProps;
  if (tagRes.msg === "OK") {
    newsList.value = [...tagRes.data];
    total.value = tagRes.total as number;
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
      getNewsList();
    }
  },
  { immediate: true }
);
const changeTab = watch(tabType, () => {
  page.value = 1;
  getNewsList();
});
</script>
<template>
  <div class="computer-news">
    <div class="news-img">
      <el-carousel trigger="click" height="350px" v-if="coverList">
        <el-carousel-item v-for="item in coverList" :key="item">
          <div class="news-img-item"><img :src="item" alt="" /></div>
        </el-carousel-item>
      </el-carousel>
      <div class="empty" v-else><el-empty description="无新闻图片" /></div>
    </div>
    <div class="news-box">
      <div class="item">
        <template v-for="(item, index) in newsList" :key="'news' + index">
          <NewsItem :item="item" @changeItem="changeNews" />
        </template>
      </div>
      <!--         hide-on-single-page -->
      <div class="page">
        <el-pagination
          v-model:currentPage="page"
          background
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="
            (newPage) => {
              page = newPage;
              getNewsList();
            }
          "
          :page-size="12"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-news {
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  @include scroll();
  .news-img {
    height: 350px;
    // @include flex(center, center, null);
    .news-img-item {
      width: calc(100vw - 30px);
      height: 350px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .empty {
      width: 100%;
      height: 100%;
      @include flex(center, center, null);
    }
  }
  .news-box {
    width: 100%;
    @include flex(center, null, wrap);
    .item {
      width: 85vw;
      min-width: 650px;
    }
    .page {
      width: 100%;
      margin: 15px 0px;
      @include flex(center, center, null);
    }
  }
}
</style>
<style></style>
