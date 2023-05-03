/*
 * @Author: Faith
 * @Date: 2023-02-04 10:49
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-01 20:04
 * @Description:
 */
import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import ElementPlus from "element-plus";
import { useI18n } from "@/plugins/i18n";
import { getServerConfig } from "./config";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";
// import { useEcharts } from "@/plugins/echarts";
import { injectResponsiveStorage } from "@/utils/responsive";

import * as L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css"
import "./assets/css/map.scss";
import "./assets/css/L.Icon.Pulse.css";
import "@/utils/mapAnalysis/L.ellipse.js";
// import "../types/leaflet-geoman.d"
// import '@geoman-io/leaflet-geoman-free';
// import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
// L.PM.setOptIn(false);
// console.log(L.PM);
import "@/config/config";
// import "@/utils/measure"

// import Table from "@pureadmin/table";
// import PureDescriptions from "@pureadmin/descriptions";

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/index.scss";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";
import "element-plus/dist/index.css";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";

import "@supermap/iclient-leaflet";

import DragCard from "@/layout/components/common/DragCard.vue";

const app = createApp(App);

// 自定义指令
import * as directives from "@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册`@iconify/vue`图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

app.component("DragCard", DragCard);

// 全局注册按钮级别权限组件
import { Auth } from "@/components/ReAuth";
app.component("Auth", Auth);

app.config.globalProperties.L = L;

// app.config.globalProperties.$BASE_CONFIG = BASE_CONFIG

getServerConfig(app).then(async config => {
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app.use(MotionPlugin).use(useI18n).use(ElementPlus);
  // .use(useEcharts);
  // .use(Table);
  // .use(PureDescriptions);
  app.mount("#app");
});
