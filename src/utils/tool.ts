/*
 * @Author: Faith
 * @Date: 2023-03-30 19:46
 * @LastAuthor: Faith
 * @LastEditTime: 2023-03-30 20:15
 * @Description:
 */
// 防抖
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200
): (...args: Parameters<T>) => void {
  let timer: any = null;
  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timer!);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 节流
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200
): (...args: Parameters<T>) => void {
  let timer: any = null;
  return function (this: any, ...args: Parameters<T>): void {
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
