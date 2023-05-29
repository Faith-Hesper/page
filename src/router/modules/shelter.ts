/*
 * @Author: Faith
 * @Date: 2023-04-17 16:31
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-03 21:53
 * @Description:
 */
import { $t } from "@/plugins/i18n";
import shelter from "@/assets/svg/shelter.svg?component";

export default {
  path: "/shelter",
  name: "shelter",
  props: true,
  component: () => import("@/views/shelter/index.vue"),
  meta: {
    icon: shelter,
    title: "避难所",
    rank: 3,
    keepAlive: true
  }
} as RouteConfigsTable;
