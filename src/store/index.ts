import { authStore } from "@/store/auth";
import { commonStore } from "@/store/common";
import { tagStore } from "@/store/tag";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  commonStore: ReturnType<typeof commonStore>;
  tagStore: ReturnType<typeof tagStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */
export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.commonStore = commonStore();
  appStore.tagStore = tagStore();
};

export default appStore;
