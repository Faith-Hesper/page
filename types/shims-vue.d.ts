/*
 * @Author: Faith
 * @Date: 2023-02-04 10:49
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-29 10:47
 * @Description:
 */
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "@supermap/iclient-leaflet";
// declare module 'leaflet'
