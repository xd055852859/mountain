import { is_mobile } from "@/services/util";
import appStore from "@/store";
import { storeToRefs } from "pinia";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const { deviceType } = storeToRefs(appStore.commonStore);
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
    children: [],
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home.vue"),
  },
  {
    path: "/phone",
    name: "phone",
    component: () => import("@/views/phone/home.vue"),
    redirect: "/phone/resource",
    children: [
      {
        path: "news",
        name: "phoneNews",
        component: () => import("@/views/phone/news.vue"),
        children: [],
      },
      {
        path: "circle",
        name: "phoneCircle",
        component: () => import("@/views/phone/circle.vue"),
        children: [],
      },
      {
        path: "resource",
        name: "phoneResource",
        component: () => import("@/views/phone/resource.vue"),
        children: [],
      },
      {
        path: "environment",
        name: "phoneEnvironment",
        component: () => import("@/views/phone/environment.vue"),
        children: [],
      },
      {
        path: "userCenter",
        name: "phoneUserCenter",
        component: () => import("@/views/phone/userCenter.vue"),
        children: [],
      },
      {
        path: "resourceList/:id",
        name: "phoneResourceList",
        component: () => import("@/views/phone/resourceList.vue"),
        children: [],
      },
    ],
  },
  {
    path: "/computer",
    name: "computer",
    component: () => import("@/views/computer/index.vue"),
    redirect: "/computer/home",
    children: [
      {
        path: "home",
        name: "computerHome",
        component: () => import("@/views/computer/home.vue"),
        children: [],
      },
      {
        path: "news",
        name: "computerNews",
        component: () => import("@/views/computer/news.vue"),
        children: [],
      },
      {
        path: "circle",
        name: "computerCircle",
        component: () => import("@/views/computer/circle.vue"),
        children: [],
      },
      {
        path: "resourceList",
        name: "computerResourceList",
        component: () => import("@/views/computer/resourceList.vue"),
        children: [],
      },
      {
        path: "environment",
        name: "computerEnvironment",
        component: () => import("@/views/computer/environment.vue"),
        children: [],
      },
      {
        path: "userCenter",
        name: "computerUserCenter",
        component: () => import("@/views/computer/userCenter.vue"),
        children: [],
      },
    ],
  },
  {
    path: "/screen",
    name: "screen",
    component: () => import("@/views/screen/index.vue"),
    redirect: "/screen/newHome",
    children: [
      {
        path: "home",
        name: "screenHome",
        component: () => import("@/views/screen/home.vue"),
        children: [],
      },
      {
        path: "resource",
        name: "screenResource",
        component: () => import("@/views/screen/resource.vue"),
        children: [],
      },
      {
        path: "labour",
        name: "screenLabour",
        component: () => import("@/views/screen/labour.vue"),
        children: [],
      },
      {
        path: "environment",
        name: "screenEnvironment",
        component: () => import("@/views/screen/environment.vue"),
        children: [],
      },
      {
        path: "newhome",
        name: "screenNewHome",
        component: () => import("@/views/screen/newHome.vue"),
        children: [],
      },
    ],
  },
  {
    path: "/phoneAddCircle",
    name: "phoneAddCircle",
    component: () => import("@/views/phone/addCircle.vue"),
    children: [],
  },
  {
    path: "/circleInfo/:id",
    name: "circleInfo",
    component: () => import("@/views/circleInfo.vue"),
    children: [],
  },
  {
    path: "/newsInfo/:id",
    name: "newsInfo",
    component: () => import("@/views/newsInfo.vue"),
    children: [],
  },
  {
    path: "/resourceForm",
    name: "resourceForm",
    component: () => import("@/views/resourceForm.vue"),
    children: [],
  },
  {
    path: "/environmentForm",
    name: "environmentForm",
    component: () => import("@/views/environmentForm.vue"),
    children: [],
  },
  {
    path: "/certified",
    name: "certified",
    component: () => import("@/views/certified.vue"),
    children: [],
  },

  {
    path: "/resourceInfo",
    name: "resourceInfo",
    component: () => import("@/views/resourceInfo.vue"),
    children: [],
  },
  {
    path: "/environmentInfo/:id",
    name: "environmentInfo",
    component: () => import("@/views/environmentInfo.vue"),
    children: [],
  },

  {
    path: "/resourceReport",
    name: "resourceReport",
    component: () => import("@/views/resourceReport.vue"),
    children: [],
  },
  {
    path: "/userEnvironmentList",
    name: "userEnvironmentList",
    component: () => import("@/views/userEnvironment.vue"),
    children: [],
  },
  {
    path: "/userCircle",
    name: "userCircle",
    component: () => import("@/views/userCircle.vue"),
    children: [],
  },
  {
    path: "/userReport/:id",
    name: "userReport",
    component: () => import("@/views/userReport.vue"),
    children: [],
  },
  {
    path: "/userEdit",
    name: "userEdit",
    component: () => import("@/views/userEdit.vue"),
    children: [],
  },
  {
    path: "/searchResource",
    name: "searchResource",
    component: () => import("@/views/searchResource.vue"),
    children: [],
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
    children: [],
  },
];
const routerHistory = createWebHashHistory();
const router = createRouter({
  history: routerHistory,
  routes,
});
//全局前置守卫
// 全局导航守卫
export default router;
