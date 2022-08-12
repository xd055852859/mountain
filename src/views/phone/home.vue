<script setup lang="ts">
import appStore from "@/store";
import { ArrowDown } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { Region, ResultProps } from "@/interface/Common";
import api from "@/services/api";
const router = useRouter();
const { setDeviceType } = appStore.commonStore;
const { token, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);

const headerVisible = ref<boolean>(false);
const cityArray = ref<Region[]>([]);
const districtArray = ref<Region[]>([]);
const townArray = ref<Region[]>([]);
const villageArray = ref<Region[]>([]);
const cityIndex = ref<number | null>(0);
const districtIndex = ref<number | null>(0);
const townIndex = ref<number | null>(0);
const villageIndex = ref<number | null>(null);
onMounted(() => {
  const deviceWidth = document.documentElement.offsetWidth;
  if (deviceWidth > 700) {
    setDeviceType("computer");
    router.replace(`/computer/`);
  }
});
const toUrl = (url: string) => {
  router.push(`/phone/${url}`);
};
const getRegion = async (level: number, code: string) => {
  const regionRes = (await api.request.get("regionCode/subByCode", {
    code: code,
  })) as ResultProps;
  if (regionRes.msg === "OK") {
    switch (level) {
      case 1:
        cityArray.value = [...regionRes.data];
        cityIndex.value = 0;
        districtIndex.value = 0;
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(2, cityArray.value[0].areaCode);
        break;
      case 2:
        districtArray.value = [...regionRes.data];
        districtIndex.value = 0;
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(3, districtArray.value[0].areaCode);
        break;
      case 3:
        townArray.value = [...regionRes.data];
        townIndex.value = 0;
        villageIndex.value = null;
        getRegion(4, townArray.value[0].areaCode);
        break;
      case 4:
        villageArray.value = [...regionRes.data];
        villageIndex.value = null;
        break;
    }
  }
};
const chooseArea = (level: number, index: number, item: Region) => {
  if (item.codeName) {
    window.open(
      `${window.location.protocol}//${window.location.host}/${item.codeName}#/${deviceType.value}/`
    );
  }
  switch (level) {
    case 3:
      cityIndex.value = index;
      getRegion(2, cityArray.value[index].areaCode);
      break;
    case 4:
      districtIndex.value = index;
      getRegion(3, districtArray.value[index].areaCode);
      break;
    case 5:
      townIndex.value = index;
      getRegion(4, townArray.value[index].areaCode);
      break;
    case 6:
      villageIndex.value = index;
      break;
  }
};
watch(
  domain,
  (newDomain, oldDomain) => {
    if (newDomain && !oldDomain) {
      getRegion(newDomain.level, newDomain.regionCode);
    }
  },
  { immediate: true }
);
</script>
<template>
  <div @click="headerVisible = true" class="phone-header-area">
    {{ domain?.name }}
    <el-icon color="#999" style="margin-left: 5px"><arrow-down /></el-icon>
  </div>
  <div class="phone-container"><router-view></router-view></div>
  <div class="phone-nav dp--center">
    <div
      :class="{ 'common-color': $route.name === 'phoneResource' }"
      @click="token ? toUrl('resource') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="mountain"
          :color="$route.name === 'phoneResource' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>两山</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneNews' }"
      @click="toUrl('news')"
    >
      <div>
        <iconpark-icon
          name="news"
          :color="$route.name === 'phoneNews' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>新闻</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneCircle' }"
      @click="toUrl('circle')"
    >
      <div>
        <iconpark-icon
          name="circle"
          :color="$route.name === 'phoneCircle' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>圈子</div>
    </div>

    <div
      :class="{ 'common-color': $route.name === 'phoneEnvironment' }"
      @click="token ? toUrl('environment') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="environment"
          :color="$route.name === 'phoneEnvironment' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>治理</div>
    </div>
    <div
      :class="{ 'common-color': $route.name === 'phoneUserCenter' }"
      @click="token ? toUrl('userCenter') : $router.push('/login')"
    >
      <div>
        <iconpark-icon
          name="my"
          :color="$route.name === 'phoneUserCenter' ? '#67c23a' : '#555'"
          size="25"
        />
      </div>
      <div>我的</div>
    </div>
  </div>
  <el-drawer
    v-model="headerVisible"
    title="区域选择"
    :with-header="false"
    :size="350"
    custom-class="p0-drawer"
  >
    <div class="header-area" v-if="domain?.level">
      <div v-if="domain.level < 2" class="area-name">市级</div>
      <div class="area-box">
        <div
          v-for="(item, index) in cityArray"
          :key="'city' + index"
          @click="chooseArea(3, index, item)"
          :class="{
            'choose-item': cityIndex === index,
            unName: !item.codeName,
          }"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-if="domain.level < 3" class="area-name">区县</div>
      <div class="area-box">
        <div
          v-for="(item, index) in districtArray"
          :key="'district' + index"
          @click="chooseArea(4, index, item)"
          :class="{
            'choose-item': districtIndex === index,
            unName: !item.codeName,
          }"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-if="domain.level < 4" class="area-name">乡镇</div>
      <div class="area-box">
        <div
          v-for="(item, index) in townArray"
          :key="'town' + index"
          @click="chooseArea(5, index, item)"
          :class="{
            'choose-item': townIndex === index,
            unName: !item.codeName,
          }"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-if="domain.level < 5" class="area-name">村级</div>
      <div class="area-box">
        <div
          v-for="(item, index) in villageArray"
          :key="'village' + index"
          @click="chooseArea(6, index, item)"
          :class="{
            'choose-item': villageIndex === index,
            unName: !item.codeName,
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<style scoped lang="scss">
.phone-container {
  width: 100vw;
  height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.phone-nav {
  width: 100vw;
  height: 50px;
  background-color: #fff;
  position: fixed;
  z-index: 2;
  left: 0px;
  bottom: 0px;
  // @include p-number(15px);
  > div {
    width: 20%;
    height: 100%;
    @include flex(center, center, wrap);
    cursor: pointer;
    background-color: #fff;
    font-size: 12px;
    > div {
      width: 100%;
      @include flex(center, center, null);
    }
  }
}
.phone-header-area {
  height: 55px;
  position: fixed;
  top: 0px;
  left: 30px;
  z-index: 5;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  @include flex(null, center, null);
}
.header-area {
  height: 100%;
  @include scroll();
  .area-name {
    height: 40px;
    font-weight: 500;
    font-size: 16px;
    @include flex(null, center, null);
  }
  .area-box {
    @include flex(null, center, wrap);
    > div {
      width: 33%;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 10px;
      // @include flex(center, center, wrap);
      border-radius: 4px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }

    .unName {
      color: #c5c5c5;
    }
    .choose-item {
      background: #d0efd8;
      color: #46a03c;
    }
  }
}
</style>
<style></style>
