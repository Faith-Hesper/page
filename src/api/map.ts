/*
 * @Author: Faith
 * @Date: 2023-02-04 17:37
 * @LastAuthor: Faith
 * @LastEditTime: 2023-03-24 14:46
 * @Description:
 */
import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const gaode = (pageNum: number, city = "唐山市") => {
  return http.request<Result>(
    "get",
    `/gaode/v3/place/text?key=5833fc2ab01735a6c6fd3a72d1b43459&keywords=应急&city=${city}&page=${pageNum}&citylimit=true&extensions=all&children=1`
  );
};

export const earthquake = () => {
  return http.request<Result>("get", "/api/earth");
};

export const sqlData = (date: Date) => {
  return http.request<Result>("get", "/api/info", { params: { date: date } });
};
