/*
 * @Author: Faith
 * @Date: 2023-04-30 20:19
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-01 16:45
 * @Description:
 */
import { $t } from "@/plugins/i18n";
import DashBoard from "@/assets/svg/DashBoard.svg?component";

export default {
  path: "/visual",
  redirect: "/visual/index",
  meta: {
    icon: DashBoard,
    title: "可视化",
    rank: 2
  },
  children: [
    {
      path: "/visual/index",
      name: "visual",
      component: () => import("@/views/visualization/index.vue"),
      meta: {
        icon: DashBoard,
        title: "可视化"
      }
    }
  ]
} as RouteConfigsTable;
