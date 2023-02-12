/*
 * @Author: Faith
 * @Date: 2022-08-07 09:57
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-07 09:57
 * @Description:
 */

// 节流
function throttle(fn, delay = 200) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(context, args)
    }, delay)
  }
}

// 防抖
function debounce(fn, delay = 200) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

export { throttle, debounce }
