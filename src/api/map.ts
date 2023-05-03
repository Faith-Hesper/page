/*
 * @Author: Faith
 * @Date: 2023-02-04 17:37
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-02 11:02
 * @Description:
 */
import axios from "axios";
import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};
type searchResult = {
  success: boolean;
  data: {
    data: Array<any>;
    jieguo: string;
    num: number;
  };
};
type allDataResult = {
  success: boolean;
  data: any;
};
// 查询POI
export const gaodePoi = (keywords?: string, pageNum?: number) => {
  return http.request<any>("get", `/gaode/v5/place/text`, {
    params: {
      keywords: keywords || "应急|避难|地震",
      page_size: 25,
      page_num: pageNum || 1,
      output: "json",
      show_fields: "business,photos",
      key: "9e0e94d92d5a912fdac6b10b7f1fe75a"
    }
  });
};

// 获取高德提示
export const gaodeTip = k => {
  return http.request<any>("get", `/gaode/v3/assistant/inputtips`, {
    params: {
      keywords: k || "北京市",
      output: "json",
      key: "9e0e94d92d5a912fdac6b10b7f1fe75a"
    }
  });
};

// openstreetmap 查询地理信息
export const searchGeo = q => {
  return http.request<Result>("get", "/geo/search", {
    params: {
      q: q || "北京市",
      polygon_geojson: 1,
      format: "jsonv2"
    }
  });
};
const tiandiURL = "http://api.tianditu.gov.cn";
/**
 *
 * 搜索类型（1：普通搜索，
 * 2：视野内搜索，
 * 3：周边搜索，
 * 4：普通建议词搜索，
 * 5：公交规划建议词搜索，
 * 6：公交规划起止点搜索（只搜索公交站），
 * 7： 纯地名搜索（不搜公交线），
 * 10：拉框搜索
 */
interface searchParams {
  keyWord?: string;
  queryType?: number;
  start?: number;
  count?: number;
  level?: number;
  mapBound?: string;
}
/**
 *
 * @param keyWord 搜索的关键字
 * @param queryType 搜索类型
 * @param start 返回结果起始位
 * @param count 返回的结果数量
 * @param level 目前查询的级别 (1,20)
 * @param mapBound 查询的地图范围("-x,-y,x,y")
 * @returns
 */
export const tiandiSearchGeo = (searchParams: searchParams) => {
  const {
    keyWord = "北京市",
    level = "18",
    mapBound = "-180,-90,180,90",
    queryType = "4",
    count = "20",
    start = "0"
  } = searchParams;
  const k = keyWord || "北京市";
  const postStr = `{'keyWord':'${k}','level':'${level}','mapBound':'${mapBound}','queryType':'${queryType}','count':'${count}','start':'${start}'}`;
  return http.request<any>("get", `/tianditu/search`, {
    params: {
      // postStr: "{'keyWord':'超','level':'15','mapBound':'-180,-90,180,90','queryType':'4','count':'10','start':'0'}",
      postStr,
      type: "query",
      tk: window.BASE_CONFIG.key
    }
  });
};

export const earthquake = () => {
  return http.request<Result>("get", "/api/earth");
};

export const quickQuake = (page, num, cb) => {
  const socket = new WebSocket("ws://localhost:3021/curQuake");
  socket.onopen = function (event) {
    const params = {
      page,
      num
    };
    socket.send(JSON.stringify(params));
  };
  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(event);
    cb(data.data);
    // handleData(data);
  };

  socket.onerror = function (event) {
    console.error("WebSocket 连接错误");
  };

  socket.onclose = function (event) {
    console.log("WebSocket 连接关闭");
  };
  return socket;
};
export const speedsearch = (page, num) => {
  return http.request<searchResult>("get", "/api/speedsearch", {
    params: {
      page: page,
      num: num
    }
  });
};

export const statisticsTimes = (from, to, M) => {
  return http.request<any>("get", "/api/sql", {
    params: {
      from: from,
      to: to,
      M: M
    }
  });
};

export const surrounding = (lat, lng, M) => {
  return http.request<Result>("get", "/api/surrounding", {
    params: {
      lat: lat,
      lng: lng,
      M: M
    }
  });
};

export const sqlData = (date: Date) => {
  return http.request<Result>("get", "/api/info", { params: { date: date } });
};
export const allData = (from, to, M) => {
  return http.request<allDataResult>("get", "/api/allData", {
    params: {
      from: from,
      to: to,
      M: M
    }
  });
};
