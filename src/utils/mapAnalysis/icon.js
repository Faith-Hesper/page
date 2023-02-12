/*
 * @Author: Faith
 * @Date: 2022-08-07 14:19
 * @LastAuthor: Faith
 * @LastEditTime: 2022-08-07 14:19
 * @Description:
 */

import "@/utils/L.Icon.Pulse"

const pulsingIcon = (size = 12, color = "F60", fillColor = "FAA90E", animate = true) => {
  return L.icon.pulse({
    iconSize: [size, size],
    color: color,
    fillColor: fillColor, // 填充色
    animate: animate,
  })
}

export { pulsingIcon }
