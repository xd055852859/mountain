<script setup lang="ts">
import pHeader from "@/components/phone/pHeader.vue";
import { uploadImage } from "@/services/util";
import { Plus, ArrowDown } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import api from "@/services/api";
import chooseSvg from "@/assets/svg/choose.svg";
import { ResultProps } from "@/interface/Common";
import { ElMessage } from "element-plus";
import { Circle } from "@/interface/Circle";
const router = useRouter();
const { uploadToken, domain, user } = storeToRefs(appStore.authStore);
const { deviceType } = storeToRefs(appStore.commonStore);
const { getUploadToken } = appStore.authStore;
const { circleTag, circleIndex } = storeToRefs(appStore.tagStore);
const { getTag, setCircleIndex } = appStore.tagStore;
const circleTitle = ref<string>("");
const imageList = ref<any>([]);
const emits = defineEmits<{
  (e: "addCircleList", item: Circle): void;
}>();
onMounted(() => {
  getUploadToken();
});

const updateImg = (file, type) => {
  let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
  if (type === "single") {
    uploadImage(file, uploadToken.value, mimeType, (url: string) => {
      imageList.value.push(url);
      // editorInfo.value?.chain().insertContent(`<img src="${url}">`).run();
    });
  } else {
    for (let i = 0; i < file.length; i++) {
      uploadImage(file[i], uploadToken.value, mimeType, (url: string) => {
        imageList.value.push(url);
        // editorInfo.value?.chain().insertContent(`<img src="${url}">`).run();
      });
    }
  }
};
const delImg = (index) => {
  imageList.value.splice(index, 1);
};
const pasteImg = (event) => {
  console.log(event);
  var isChrome = false;
  if (event.clipboardData || event.originalEvent) {
    var clipboardData =
      event.clipboardData || event.originalEvent.clipboardData;
    console.log(clipboardData);
    if (clipboardData.items) {
      // for chrome
      var items = clipboardData.items,
        len = items.length,
        blob = null;
      isChrome = true;

      event.preventDefault();
      console.log(items);
      for (var i = 0; i < len; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          updateImg(items[i].getAsFile(), "single");
        }
      }
    }
  }
};
const postCircle = async () => {
  if (circleTag.value) {
    const postTagRes = (await api.request.post("article", {
      articleType: "Blog",
      tagKey:
        circleTag.value[circleIndex.value === 100 ? 0 : circleIndex.value]._key,
      content: circleTitle.value,
      summary: circleTitle.value.substring(0, 100),
      imageList: imageList.value,
    })) as ResultProps;
    if (postTagRes.msg === "OK") {
      ElMessage({
        message: `发布成功`,
        type: "success",
        duration: 1000,
      });
      circleTitle.value = "";
      imageList.value = [];
      if (deviceType.value === "computer") {
        emits("addCircleList", { ...postTagRes.data, creatorInfo: user.value });
      } else if (deviceType.value === "phone") {
        router.push(`/phone/circle`);
      }
    }
  }
};
watch(
  [domain, circleTag],
  ([newDomain, newVal]) => {
    if (newDomain && newVal.length === 0) {
      getTag("Blog");
    }
  },
  { immediate: true }
);
</script>
<template>
  <pHeader v-if="deviceType === 'phone'">
    <template v-slot:title>发圈子</template>
  </pHeader>
  <div
    class="addCircle"
    v-if="circleTag.length > 0"
    :style="deviceType === 'phone' ? { height: 'calc(100vh - 60px)' } : {}"
    @paste="pasteImg"
  >
    <div
      class="container"
      :style="deviceType === 'phone' ? { height: 'calc(100vh - 160px)' } : {}"
    >
      <div class="edit">
        <el-input
          v-model="circleTitle"
          :autosize="{ minRows: 8 }"
          type="textarea"
          placeholder="有什么新鲜事就和大家分享吧"
          autofocus
        />
        <div class="button">
          <el-dropdown>
            <span style="font-size: 14px" class="icon-point common-color"
              >{{ circleTag[circleIndex === 100 ? 0 : circleIndex].name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu
                v-for="(item, index) in circleTag"
                :key="'tag' + index"
              >
                <el-dropdown-item @click="setCircleIndex(index)"
                  ><div
                    class="dp-space-center"
                    style="width: 130px; font-size: 16px; color: #777"
                  >
                    <div>{{ item.name }}</div>
                    <div class="dp--center">
                      <img
                        :src="chooseSvg"
                        alt=""
                        style="width: 20px; height: 20px; margin-right: 10px"
                        v-if="circleIndex === index"
                      />
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            type="success"
            style="width: 70px; height: 40px"
            @click="postCircle"
            v-if="deviceType === 'computer'"
            >提交</el-button
          >
        </div>
      </div>
      <div class="upload dp--center">
        <div
          class="upload-img"
          v-for="(item, index) in imageList"
          :key="'img' + index"
        >
          <el-image
            style="width: 60px; height: 60px"
            :src="item"
            :preview-src-list="imageList"
            :initial-index="index"
            fit="cover"
            :hide-on-click-modal="true"
            :preview-teleported="true"
          />
          <div class="upload-delete">
            <icon-font
              name="close"
              :size="22"
              class="icon-point"
              @click.stop="delImg(index)"
            />
          </div>
        </div>
        <div
          class="upload-button dp-center-center icon-point"
          v-if="imageList.length < 10"
        >
          <el-icon><plus /></el-icon>
          <input
            type="file"
            accept="image/*"
            @change="
              //@ts-ignore
              updateImg($event.target.files)
            "
            class="upload-button-img"
            multiple
          />
        </div>
      </div>
    </div>
    <div class="addCircle-button">
      <el-button
        type="success"
        style="width: 100%; height: 40px"
        @click="postCircle"
        v-if="deviceType === 'phone'"
        >提交</el-button
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.addCircle {
  width: 100%;
  @include p-number(15px);
  .container {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .edit {
      width: 100%;
      min-height: 200px;
      border: 2px solid rgba(30, 30, 30, 1);
      border-radius: 8px;
      padding: 10px 15px;
      box-sizing: border-box;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
      .button {
        width: 100%;
        height: 40px;
        @include flex(space-between, center, null);
      }
    }
  }
  .addCircle-button {
    width: 100%;
    position: fixed;
    left: 0px;
    bottom: 20px;
    z-index: 5;
    @include p-number(15px);
  }
}
</style>
<style lang="scss">
.addCircle {
  .el-textarea__inner {
    box-shadow: none;
    padding-left: 0px;
    padding-right: 0px;
    resize: none;
    background-color: transparent;
    // font-size: 18px !important;
    // height: auto !important;
    &:focus {
      outline: none !important;
    }
  }
}
</style>
