/*
 * @Author: Faith
 * @Date: 2023-04-12 09:30
 * @LastAuthor: Faith
 * @LastEditTime: 2023-05-01 19:20
 * @Description:
 */
import {
  onMounted,
  isRef,
  ref,
  shallowReactive,
  watch,
  watchEffect,
  type Ref,
  onUnmounted
} from "vue";
import { message } from "@/utils/message";
import { earthquake, speedsearch, quickQuake } from "@/api/map";

interface socketResult {
  data: string | any[];
  jieguo: string;
  num: number;
}

const quakeInfoText = (time, location, M) => {
  return `${time} ${location} 发生${M} 级地震`;
};

export function useSocket(param?: any) {
  const socket = ref();
  const result: Ref<socketResult> = ref({
    data: "",
    jieguo: "",
    num: 1
  });

  function fetch() {
    // console.log(param);
    socket.value = quickQuake(1, 1, function (resData) {
      if (typeof resData.data === "string" || typeof resData === "string") {
        message(resData);
        result.value = {
          data: resData,
          jieguo: resData.jieguo || "",
          num: resData.num || 1
        };
        return;
      } else {
        // console.log(resData);
        // const tempData = resData.data?.map(item => {
        //   return quakeInfoText(item.O_TIME, item.LOCATION_C, item.M);
        // });
        const fData = resData.data[0];
        message(quakeInfoText(fData.O_TIME, fData.LOCATION_C, fData.M));
        result.value = {
          data: resData.data,
          jieguo: resData.jieguo,
          num: resData.num
        };
      }
    });
  }

  if (param && isRef(param)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watch(
      param,
      () => {
        console.log("数据更新");
        fetch();
      },
      {
        immediate: true
      }
    );
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    fetch();
  }

  function fresh() {
    const params = { page: 1, num: 1 };
    socket.value.send(JSON.stringify(params));
  }

  onUnmounted(() => {
    if (socket.value) {
      socket.value.send("close");
    }
  });
  return { socket, result };
}
