<script setup lang="ts">
import { is_mobile } from "@/services/util";
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import CHeader from "@/components/computer/cHeader.vue";
const { setDeviceType } = appStore.commonStore;
const { deviceType } = storeToRefs(appStore.commonStore);
const router = useRouter();
onMounted(() => {
  const deviceWidth = document.documentElement.offsetWidth;
  if (is_mobile() || deviceWidth < 700) {
    console.log("???????", deviceType.value);
    setDeviceType("phone");
    router.replace(`/phone/`);
  }
});
</script>
<template>
  <CHeader />
  <div class="computer">
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.computer {
  width: 100%;
  height: 100vh;
  @include scroll();
}
</style>
<style></style>
