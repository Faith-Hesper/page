/*
 * @Author: Faith
 * @Date: 2023-02-04 10:49
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-14 09:56
 * @Description:
 */
import dayjs from "dayjs";
import { resolve } from "path";
import pkg from "./package.json";
import { warpperEnv } from "./build";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build")
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      open: true,
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        "/tianditu": {
          target: "http://api.tianditu.gov.cn",
          ws: true,
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/tianditu/, "")
        },
        "/gaode": {
          target: "https://restapi.amap.com",
          ws: true,
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/gaode/, "")
        },
        "/geo": {
          target: "https://nominatim.openstreetmap.org",
          ws: true,
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/geo/, "")
        },
        "/api": {
          target: "http://localhost:3021/",
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      }
    },
    plugins: getPluginsList(command, VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
          // manualChunks: {
          //   // "@supermap/iclient-leaflet": ["@supermap/iclient-leaflet"],
          //   // 试了一下传字符串也是可以的
          //   leaflet: ["leaflet"],
          //   echarts: ["echarts"],
          //   // "element-plus": ["element-plus"],
          //   axios: ["axios"],
          //   vue: ["vue"],
          // },
        }
      }
    },
    define: {
      "process.env": {},
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
