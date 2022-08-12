<script setup lang="ts">
import { ElMessage } from "element-plus";
import Avatar from "@/components/avatar.vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { is_mobile } from "@/services/util";
import { ArrowLeft, ArrowRight, ArrowDown } from "@element-plus/icons-vue";
import request from "@/services/api";
import router from "@/router";
import api from "@/services/api";
import { Region, ResultProps } from "@/interface/Common";

const { token, user, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const { newsTag, circleTag } = storeToRefs(appStore.tagStore);
const { setToken, setUserInfo } = appStore.authStore;
const { setTabType } = appStore.commonStore;
const navRef = ref<any>(null);
const scrollState = ref<boolean>(false);
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
  getTag("News");
  getTag("Blog");
});

const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}#/${deviceType.value}/`
  );
  console.log(redirect);
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=10&apphigh=55&logo=https://workfly.qingtime.cn/1652428088606_workingVip.png&redirect=${redirect}`;
  if (is_mobile()) {
    window.open(href);
  } else {
    window.open(href, "_self");
  }
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
        villageIndex.value = null;
        villageArray.value = [...regionRes.data];
        break;
    }
  }
};
const logout = () => {
  router.push("/computer/");
  localStorage.removeItem("token");
  request.setToken("");
  setToken("");
  setUserInfo(null);
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

const getTag = async (type: string) => {
  const tagRes = (await api.request.get("tag", {
    tagType: type,
  })) as ResultProps;
  if (tagRes.msg === "OK") {
    if (type === "Blog") {
      circleTag.value = tagRes.data.map((item) => {
        return {
          _key: item._key,
          icon: item.icon,
          name: item.name,
          type: item.type,
        };
      });
    } else if (type === "News") {
      newsTag.value = tagRes.data.map((item) => {
        return {
          _key: item._key,
          icon: item.icon,
          name: item.name,
          type: item.type,
        };
      });
    }
  }
};
watch(headerVisible, (newVisible) => {
  if (newVisible && domain.value) {
    getRegion(domain.value.level, domain.value.regionCode);
  }
});
</script>
<template>
  <div class="computer-header">
    <div class="computer-header-container">
      <el-popover placement="bottom" :width="'95vw'" trigger="click">
        <template #reference>
          <div class="left" @click="headerVisible = true">
            <img :src="domain.logo" alt="" v-if="domain" /> {{ domain?.name }}
            <el-icon color="#fff" style="margin-left: 8px"
              ><arrow-down
            /></el-icon>
          </div>
        </template>
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
      </el-popover>
      <div class="right">
        <div class="header-nav-box" ref="navRef">
          <div class="header-nav">
            <div
              @click="$router.push('/computer/home')"
              :class="{ 'choose-nav': $route.name === 'computerHome' }"
            >
              首页
            </div>
            <div
              :class="{ 'choose-nav': $route.name === 'computerResourceList' }"
            >
              <el-dropdown>
                <div style="color: #fff">资源</div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="
                        $router.push('/computer/resourceList');
                        setTabType(1);
                      "
                    >
                      资源交易</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="
                        $router.push('/computer/resourceList');
                        setTabType(2);
                      "
                      >资源报价</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="
                        $router.push('/computer/resourceList');
                        setTabType(3);
                      "
                      >劳务项目</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div :class="{ 'choose-nav': $route.name === 'computerNews' }">
              <el-dropdown>
                <div style="color: #fff">新闻</div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="
                        $router.push('/computer/news');
                        setTabType(100);
                      "
                    >
                      推荐</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="
                        $router.push('/computer/news');
                        setTabType(101);
                      "
                      >热榜</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-for="(item, index) in newsTag"
                      :key="'tag' + index"
                      @click="
                        $router.push('/computer/news');
                        setTabType(index);
                      "
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <el-popover placement="bottom" :width="'400px'" trigger="hover">
              <template #reference>
                <div
                  :class="{ 'choose-nav': $route.name === 'computerCircle' }"
                >
                  圈子
                </div>
              </template>
              <div class="header-tab dp--center">
                <div
                  class="tab-item icon-point"
                  @click="
                    $router.push('/computer/circle');
                    setTabType(100);
                  "
                >
                  <div><iconpark-icon name="new" size="24" /></div>
                  <div>最新</div>
                </div>
                <div
                  v-for="(item, index) in circleTag"
                  :key="'tag' + index"
                  class="tab-item icon-point"
                  @click="
                    $router.push('/computer/circle');
                    setTabType(index);
                  "
                >
                  <div>
                    <img :src="item.icon" alt="" v-if="item.icon" />
                    <iconpark-icon name="defaultTag" v-else size="24" />
                  </div>
                  <div>{{ item.name }}</div>
                </div>
              </div>
            </el-popover>
            <div
              @click="$router.push('/computer/environment')"
              :class="{ 'choose-nav': $route.name === 'computerEnvironment' }"
            >
              环境治理
            </div>
          </div>
        </div>
        <div @click="$router.push('/computer/userCenter')" v-if="user">
          <avatar
            :name="user.userName"
            :avatar="user.userAvatar"
            type="person"
            :index="0"
            :size="40"
            :avatarStyle="{ fontSize: '16px', marginRight: '8px' }"
          />
        </div>

        <el-button type="success" @click="login()" v-if="!user"
          >登录 / 注册</el-button
        >
        <el-button
          type="success"
          @click="logout"
          v-if="$route.name === 'computerUserCenter' && user"
          >退出登录</el-button
        >
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.computer-header {
  width: 100vw;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  @include flex(center, center, null);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 5;
  .computer-header-container {
    width: 85vw;
    min-width: 650px;
    max-width: 1600px;
    height: 100%;
    @include flex(space-between, center, null);
    .left {
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      @include flex(null, center, null);
      height: 100%;
      > img {
        height: 80%;
        margin-right: 10px;
      }
    }
    .right {
      height: 100%;
      font-size: 14px;
      @include flex(center, center, null);
      .header-nav-leftIcon,
      .header-nav-rightIcon {
        height: 100%;
        cursor: pointer;
        @include flex(center, center, null);
      }
      .header-nav-leftIcon {
        margin-right: 20px;
      }
      .header-nav-rightIcon {
        margin: 0px 20px 0px 15px;
      }
    }
  }
}
.header-area {
  max-height: 50vh;
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
      width: 12vw;
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
.header-tab {
  width: 100%;
  flex-wrap: wrap;
  .tab-item {
    width: 25%;
    height: 50px;
    margin-bottom: 18px;
    color: #666;
    font-size: 14px;
    > div {
      width: 100%;
      @include flex(center, center, null);
      &:nth-child(1) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
.header-nav-box {
  max-width: 350px;
  height: 100%;
  margin-right: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  @include flex(null, center, null);
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  .header-nav {
    height: 100%;
    @include flex(null, center, null);
    color: #fff;
    > div {
      width: 70px;
      height: 100%;
      @include flex(center, center, null);
      cursor: pointer;
      flex-shrink: 0;
    }
    .choose-nav {
      @include choose-border(3px);
    }
  }
}
</style>
