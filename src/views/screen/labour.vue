<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import api from "@/services/api";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import NightingaleChart from "@/components/chart/nightingaleChart.vue";
import CommonMap from "@/components/commonMap.vue";
import PieChart from "@/components/chart/pieChart.vue";
import CategoryChart from "@/components/chart/categoryChart.vue";
const dayjs: any = inject("dayjs");
const { token, domain } = storeToRefs(appStore.authStore);

const labourNum = ref<number>(0);
const totalBid = ref<number>(0);
const newLabourList = ref<
  { areaName: string; name: string; tagName: string; _key: string }[]
>([]);
const inProgressNum = ref<number>(0);
const townLabour = ref<
  { code: string; count: number; fullAreaName: string; name: string }[]
>([]);
const offerList = ref<
  { areaName: string; createTime: number; name: string; userName: string }[]
>([]);
const tagLabour = ref<{ count: 1; value: 1; name: string }[]>([]);
const townName = ref<string[]>([]);
const townNum = ref<number[]>([]);
onMounted(() => {
  // console.log()
});
const getLabourData = async () => {
  const dataRes = (await api.request.get("summary/labour")) as ResultProps;
  if (dataRes.msg === "OK") {
    labourNum.value = dataRes.data.labourNum;
    totalBid.value = dataRes.data.totalBid;
    newLabourList.value = dataRes.data.newLabourList;
    inProgressNum.value = dataRes.data.inProgressNum;
    townLabour.value = dataRes.data.townLabour;
    dataRes.data.townLabour.forEach((item) => {
      townName.value.push(item.name);
      townNum.value.push(item.count);
    });
    offerList.value = dataRes.data.offerList.map((item) => {
      item.createTime = dayjs(item.createTime).format("YYYY-MM");
      return item;
    });
    tagLabour.value = dataRes.data.tagLabour.map((item) => {
      item.value = item.count;
      return item;
    });
  }
};
watch(
  domain,
  (newVal, oldVal) => {
    if (newVal?.regionCode && !oldVal) {
      getLabourData();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="screen-labour">
    <div class="left">
      <div class="top">
        <div class="screen-title">基本信息</div>
        <div class="labour-num">累计投放项目 : {{ labourNum }}个</div>
        <div class="labour-num">项目总预算 : {{ totalBid }}元</div>
      </div>
      <div class="bottom">
        <div class="screen-title">近期项目</div>
        <div class="screen-item">
          <el-table :data="newLabourList" height="100%" style="width: 100%">
            <el-table-column prop="name" label="项目名" />
            <!-- <el-table-column
              prop="userName"
              label="权利人"
              :align="'center'"
              width="120px"
            /> -->

            <el-table-column prop="areaName" label="地址" />
            <el-table-column
              prop="tagName"
              label="类型"
              :align="'center'"
              width="120px"
            />
          </el-table>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="top">
        <div>进行中项目</div>
        <div class="labour-num">{{ inProgressNum }}个</div>
      </div>
      <div class="center">
        <CommonMap
          :mapId="'labourMap'"
          :width="'90%'"
          :height="'100%'"
          type="screen"
          :point-code="townLabour"
          v-if="townLabour"
        ></CommonMap>
      </div>
      <div class="bottom">
        <div class="screen-title">各类型项目占比</div>
        <div class="screen-item">
          <el-table :data="offerList" height="100%" style="width: 100%">
            <el-table-column prop="name" label="项目名" />
            <el-table-column
              prop="userName"
              label="方案提交人"
              :align="'center'"
              width="140px"
            />

            <el-table-column prop="areaName" label="位置" />
            <el-table-column
              prop="createTime"
              label="方案提交时间"
              :align="'center'"
              width="120px"
            />
          </el-table>
        </div>
      </div>

      <!--      :point-code="townLabour" -->
    </div>
    <div class="right">
      <div class="top">
        <div class="screen-title">各类型项目占比</div>
        <div class="screen-item" v-if="tagLabour.length > 0">
          <PieChart
            :pieId="'labourPieId'"
            :pieData="tagLabour"
            :width="'100%'"
            :height="'100%'"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="screen-title">各乡镇项目占比</div>
        <div class="screen-item" v-if="townLabour.length > 0">
          <CategoryChart
            :categoryId="'labourTownId'"
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
.screen-labour {
  width: 100%;
  height: 100%;
  @include flex(space-between, center, null);
  .left {
    width: 30%;
    height: 100%;

    .top {
      width: 100%;
      height: 150px;
      box-sizing: border-box;
    }
    .bottom {
      width: 100%;
      height: calc(100% - 150px);
      box-sizing: border-box;
    }
  }
  .center {
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    .top {
      width: 100%;
      height: 80px;
      > div {
        height: 35px;
        line-height: 35px;
      }
    }
    .center {
      width: 100%;
      height: 50%;
      @include flex(center, center, wrap);
    }
    .bottom {
      width: 100%;
      height: calc(50% - 80px);
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
  .labour-num {
    height:40px;
    line-height: 40px;
    font-size: 20px;
  }
}
</style>
<style></style>
