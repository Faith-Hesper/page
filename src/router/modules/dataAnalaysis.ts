/*
 * @Author: Faith
 * @Date: 2023-04-05 11:47
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-16 15:43
 * @Description:
 */

import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/dataAnalysis",
  meta: {
    icon: "tools",
    title: "数据分析",
    rank: 1
  },
  children: [
    {
      path: "/dataAnalysis/index",
      name: "DataAnalysis",
      component: () => import("@/views/dataAnalysis/index.vue"),
      meta: {
        title: "数据分析",
        keepAlive: true
      }
    },
    {
      path: "/dataAnalysis/surround",
      name: "surround",
      component: () => import("@/views/nearbyPanel/index.vue"),
      props: true,
      meta: {
        title: "历史地震",
        showLink: false,
        keepAlive: true
      }
      // children: [
      //   {
      //     path: "/dataAnalysis/surround/:id",
      //     name: "NearBy",
      //     props: true,
      //     keepAlive: false,
      //     // query: {
      //     //   id: {
      //     //     type: "number",
      //     //     required: true
      //     //   },
      //     //   title: {
      //     //     type: "string",
      //     //     required: true
      //     //   },
      //     //   latlng: {
      //     //     type: "string",
      //     //     required: true
      //     //   }
      //     // },
      //     // props: { newsletterPopup: false },
      //     component: () => import("@/views/nearbyPanel/index.vue"),
      //     meta: {
      //       title: $t("menus.hslogin")
      //       // showLink: false,
      //     }
      //   }
      // ]
    }
  ]
} as RouteConfigsTable;
