<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NightingaleChart from "@/components/chart/nightingaleChart.vue";
import CommonMap from "@/components/commonMap.vue";
import PieChart from "@/components/chart/pieChart.vue";
import CategoryChart from "@/components/chart/categoryChart.vue";
import { number } from "echarts";
import { stringify } from "querystring";
const { token, domain } = storeToRefs(appStore.authStore);
const dayjs: any = inject("dayjs");
onMounted(() => {
  // console.log()
});
const tagEvent = ref<{ count: 1; value: 1; name: string }[]>([]);
const newEventList = ref<
  {
    areaName: string;
    uploadTime: number;
    _key: string;
    tagName: string;
    title: string;
    describe: string;
  }[]
>([]);
const townEvent = ref<
  { code: string; count: number; fullAreaName: string; name: string }[]
>([]);
const townName = ref<string[]>([]);
const townNum = ref<number[]>([]);
const doneList = ref<
  {
    areaName: string;
    tagName: string;
    uploadTime: number;
    userName: string;
    _key: string;
  }[]
>([]);
const doneNum = ref<number>(0);
const eventNum = ref<number>(0);
const inProgressNum = ref<number>(0);
const getEnvironmentData = async () => {
  const dataRes = (await api.request.get("summary/event")) as ResultProps;
  if (dataRes.msg === "OK") {
    doneList.value = dataRes.data.doneList.map((item) => {
      item.uploadTime = dayjs(item.uploadTime).format("YYYY-MM");
      item.status = "已处理";
      return item;
    });
    doneNum.value = dataRes.data.doneNum;
    eventNum.value = dataRes.data.eventNum;
    inProgressNum.value = dataRes.data.inProgressNum;
    newEventList.value = dataRes.data.newEventList.map((item) => {
      item.uploadTime = dayjs(item.uploadTime).format("YYYY-MM");
      return item;
    });
    tagEvent.value = dataRes.data.tagEvent.map((item) => {
      item.value = item.count;
      return item;
    });
    townEvent.value = dataRes.data.townEvent;
    dataRes.data.townEvent.forEach((item) => {
      townName.value.push(item.name);
      townNum.value.push(item.count);
    });
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getEnvironmentData();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="screen-environment">
    <div class="left">
      <div class="top">
        <div class="left">
          <div class="top">
            <div class="screen-title">基本信息</div>
            <div>累计投放项目: {{ inProgressNum }}个</div>
          </div>
          <div class="bottom">
            <div class="screen-title">紧急环情</div>
            <div class="screen-item environment-new">
              <div v-for="(item, index) in newEventList" :key="'new' + index">
                <div class="title">{{ item.title }}</div>
                <div class="describe">{{ item.describe }}</div>
                <div class="uploadTime">{{ item.uploadTime }}</div>
                <el-divider border-style="dashed" />
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="center-title">
            <div class="center-title-item">
              <div>未处理环情</div>
              <div>{{ eventNum }}个</div>
            </div>
            <div class="center-title-item">
              <div>已处理环情</div>
              <div>{{ doneNum }}个</div>
            </div>
          </div>
          <div class="center-map">
            <!--   -->
            <CommonMap
              :mapId="'environmentMap'"
              :point-code="townEvent"
              :width="'100%'"
              :height="'calc(100% - 35px)'"
              type="screen"
              v-if="townEvent"
            />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">已处理环情</div>
        <div class="screen-item">
          <el-table :data="doneList" height="100%" style="width: 100%">
            <el-table-column prop="tagName" label="类型" :align="'center'" />
            <el-table-column
              prop="userName"
              label="环情提交人"
              :align="'center'"
              width="120px"
            />
            <el-table-column
              prop="areaName"
              label="位置"
              :header-align="'center'"
            />
            <el-table-column
              prop="updateTime"
              label="发生时间"
              :align="'center'"
              width="120px"
            />
            <el-table-column
              prop="status"
              label="状态"
              :align="'center'"
              width="120px"
            />
          </el-table>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div class="screen-title">各类型项目占比</div>
        <div class="screen-item" v-if="tagEvent.length > 0">
          <PieChart
            :pieId="'environmentPieId'"
            :pieData="tagEvent"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">各乡镇项目占比</div>
        <div class="screen-item" v-if="townEvent.length > 0">
          <CategoryChart
            :categoryId="'environmentTownId'"
            :categoryData="townName"
            :seriesData="townNum"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.screen-environment {
  width: 100%;
  height: 100%;
  @include flex(space-between, center, null);
  .left {
    width: 70%;
    height: 100%;
    .top {
      width: 100%;
      height: 60%;
      @include flex(space-between, center, null);
      .left {
        width: 40%;
        height: 100%;
        .top {
          width: 100%;
          height: 100px;
          @include flex(center, center, wrap);
        }
        .bottom {
          width: 100%;
          height: calc(100% - 100px);
          .environment-new {
            @include scroll();
            .title {
              font-size: 16px;
            }
            .describe {
              font-size: 14px;
            }
            .uploadTime {
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
      .right {
        width: 60%;
        height: 100%;
        .center-title {
          width: 100%;
          height: 100px;
          @include flex(space-between, center, null);

          .center-title-item {
            width: 48%;
          }
        }
        .center-map {
          width: 100%;
          height: calc(100% - 100px);
        }
      }
    }
    .bottom {
      width: 100%;
      height: 40%;
    }
  }
  .right {
    width: 30%;
    height: 100%;
    .top {
      width: 100%;
      height: 40%;
    }
    .bottom {
      width: 100%;
      height: 60%;
    }
  }
}
</style>
<style></style>
