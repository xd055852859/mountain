<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";

const router = useRouter();
const props = defineProps<{
  isMenu?: boolean;
  clickState?: boolean;
}>();
const emits = defineEmits(["iconClick", "clickBack"]);
const back = () => {
  router.back();
};
</script>
<template>
  <div class="phone-header">
    <div class="left dp-space-center">
      <el-icon
        style="margin-right: 10px; cursor: pointer"
        size="20px"
        @click="back()"
        v-if="!isMenu"
      >
        <arrow-left />
      </el-icon>

      <slot name="left"></slot>
    </div>
    <div class="title dp-center-center"><slot name="title"></slot></div>
    <div class="right dp--center"><slot name="right"></slot></div>
  </div>
</template>
<style scoped lang="scss">
.phone-header {
  width: 100vw;
  height: 55px;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  padding: 0px 40px;
  box-sizing: border-box;
  @include flex(center, center, null);
  .title {
    width: 100%;
    font-size: 16px;
  }
  .left,
  .right {
    height: 100%;
    position: absolute;
    top: 0px;
    z-index: 5;
  }
  .left {
    left: 10px;

  }
  .right {
    right: 10px;
  }
}

</style>
<style lang="scss">
.header-area {
  @include p-number(15px);
}
</style>
