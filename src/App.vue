<script setup lang="ts">
import { is_mobile } from "@/services/util";
import { getSearchParamValue } from "@/services/util";
import request from "@/services/api";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { useDebounceFn } from "@vueuse/shared";
import api from "@/services/api";
import { ResultProps } from "./interface/Common";
const dayjs: any = inject("dayjs");
const router = useRouter();
const route = useRoute();
const { token, user, domain } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);

const { setToken, getUserInfo, setDomain } = appStore.authStore;
const { setDeviceType, setDeviceWidth } = appStore.commonStore;

// onBeforeMount(() => {

// });
onBeforeMount(() => {
  window.addEventListener("message", handle, false);
  const search = window.location.search
    ? window.location.search.split("?")[1]
    : window.location.hash.split("?")[1];
  let token = "";
  if (getSearchParamValue(search, "token")) {
    token = getSearchParamValue(search, "token") as string;
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token") as string;
  }
  // let url = window.location.href;
  //自动切换为https
  // if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
  //   url = url.replace("http:", "https:");
  //   window.location.replace(url);
  // }

  getDomain(token);
  const deviceWidth = document.documentElement.offsetWidth;
  if (is_mobile() || deviceWidth < 700) {
    setDeviceType("phone");
  } else {
    setDeviceType("computer");
  }
});
onMounted(() => {
  window.onresize = () => {
    const deviceWidth = document.documentElement.offsetWidth;
    setDeviceWidth(deviceWidth);
    if (is_mobile() || deviceWidth < 700) {
      setDeviceType("phone");
    } else {
      setDeviceType("computer");
    }
  };
});
onUnmounted(() => {
  window.removeEventListener("message", handle, false);
});
const getDomain = async (token: string) => {
  const domainRes = (await api.request.get("client/byCodeName", {
    codeName: window.location.pathname.replaceAll("/", ""),
    // domain: "http://localhost:8000/",
  })) as ResultProps;
  if (domainRes.msg === "OK") {
    request.setDomainKey(domainRes.data._key);
    request.setRegionCode(domainRes.data.regionCode);
    setDomain(domainRes.data);
    //@ts-ignore
    document.querySelector('link[rel="icon"]').href = domainRes.data.logo;
    document.title = domainRes.data.name;
    localStorage.setItem("domain", JSON.stringify(domainRes.data));
    request.setToken(token);
    setToken(token);
  }
};
const handle = (e: any) => {
  if (
    e.origin === "https://account.qingtime.cn" &&
    e.data.eventName === "redirect"
  ) {
    const token = getSearchParamValue(
      e.data.data.split("?")[1],
      "token"
    ) as string;
    getDomain(token);
  }
};
//初始化
watch(
  token,
  (newVal, oldVal) => {
    if (newVal) {
      getUserInfo();
    }
  },
  { immediate: true }
);
watch(
  deviceType,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
    if (newVal !== oldVal && newVal && oldVal) {
      if (newVal === "phone") {
        router.replace(`/phone/`);
      } else {
        router.replace(`/computer/`);
      }
    }
  },
  { immediate: true }
);
watch(
  route,
  (newVal, oldVal) => {
    console.log(newVal.name);
  },
  { immediate: true }
);
</script>

<template><router-view></router-view></template>

<style lang="scss">
#app {
  // background: var(--talk-bg-color);
}
*::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--el-color-success);
  border-radius: 100px;
}
.common-color {
  color: var(--el-color-success) !important;
}
.info-nav {
  height: 40px;
  margin: 20px 0px;
  @include flex(null, center, null);
}
</style>
