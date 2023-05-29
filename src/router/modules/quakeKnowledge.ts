/*
 * @Author: Faith
 * @Date: 2023-04-17 16:31
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-03 21:53
 * @Description:
 */
import { $t } from "@/plugins/i18n";
import Knowledge from "@/assets/svg/knowledge.svg?component";

export default {
  path: "/quakeKnowledge",
  name: "quakeKnowledge",
  component: () => import("@/views/quakeKnowledge/index.vue"),
  meta: {
    icon: Knowledge,
    title: "地震科普",
    rank: 4
    // keepAlive: true
  }
} as RouteConfigsTable;
