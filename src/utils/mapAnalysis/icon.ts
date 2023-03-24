/*
 * @Author: Faith
 * @Date: 2022-08-07 14:19
 * @LastAuthor: Faith
 * @LastEditTime: 2023-03-21 21:23
 * @Description:
 */

import "./L.Icon.Pulse";

type PulsingIconProps = {
  size?: number;
  color?: string;
  fillColor?: string; // 填充色
  animate?: boolean;
};

const pulsingIcon = ({
  size = 12,
  color = "F60",
  fillColor = "FAA90E",
  animate = true
}: PulsingIconProps = {}) => {
  return L.icon.pulse({
    iconSize: [size, size],
    color,
    fillColor,
    animate
  });
};

export default pulsingIcon;
