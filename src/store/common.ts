import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps, Tag } from "@/interface/Common";
import { variable } from "@/hooks/variable";
import { useCssVar } from "@vueuse/core";

// 使用setup模式定义
export const commonStore = defineStore("commonStore", () => {
  let { computerList, phoneList } = variable();
  const deviceType = ref<string>("");
  const deviceWidth = ref<number>(0);
  const lng = ref<number>(0);
  const lat = ref<number>(0);
  const tabType = ref<number>(
    parseInt(localStorage.getItem("tabType") as string) ?? 0
  );
  const el = ref(null);
  const setDeviceType = (newDeviceType: string) => {
    deviceType.value = newDeviceType;
    console.log(newDeviceType);
    // localStorage.setItem("deviceType", newDeviceType);
    if (newDeviceType === "computer") {
      computerList.value.forEach((item, index) => {
        const color_item = useCssVar(item.name, el);
        color_item.value = item.value;
      });
    } else if (newDeviceType === "phone") {
      phoneList.value.forEach((item, index) => {
        const color_item = useCssVar(item.name, el);
        color_item.value = item.value;
      });
    }
  };
  const setDeviceWidth = (newDeviceWidth: number) => {
    deviceWidth.value = newDeviceWidth;
  };

  const setLocation = (newLng, newLat) => {
    lat.value = newLat;
    lng.value = newLng;
  };
  const setTabType = (newTabType) => {
    tabType.value = newTabType;
    localStorage.setItem("tabType", newTabType + "");
  };
  return {
    deviceType,
    setDeviceType,
    lng,
    lat,
    setLocation,
    deviceWidth,
    setDeviceWidth,
    tabType,
    setTabType,
  };
});
