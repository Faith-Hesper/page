/*
 * @Author: Faith
 * @Date: 2023-02-04 10:49
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-25 12:26
 * @Description:
 */
import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: $t("menus.hslogin"),
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "homeFilled",
      title: $t("menus.hshome"),
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
  // {
  //   path: "/surround/:id",
  //   name: "surround",
  //   // props: true,
  //   props: { newsletterPopup: false },
  //   component: () => import("@/views/nearbyPanel/index.vue"),
  //   meta: {
  //     title: $t("menus.hslogin"),
  //     showLink: false,
  //     rank: 103
  //   }
  // },
] as Array<RouteConfigsTable>;
