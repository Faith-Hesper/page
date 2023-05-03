import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import House from "@iconify-icons/ep/House";
import Search from "@iconify-icons/ep/search";
import Tools from "@iconify-icons/ep/tools";
import InformationLine from "@iconify-icons/ri/information-line";
import Lollipop from "@iconify-icons/ep/lollipop";

addIcon("homeFilled", House);
addIcon("tools", Tools);
addIcon("search", Search);
addIcon("informationLine", InformationLine);
addIcon("lollipop", Lollipop);
