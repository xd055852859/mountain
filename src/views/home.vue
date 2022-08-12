<script setup lang="ts">
import appStore from "@/store";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const router = useRouter();
const { deviceType } = storeToRefs(appStore.commonStore);
onMounted(() => {
  router.push(`/${deviceType.value}/`);
});
</script>
<template></template>
<style scoped lang="scss"></style>
<style></style>
