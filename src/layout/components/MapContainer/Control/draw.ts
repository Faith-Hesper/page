/*
 * @Author: Faith
 * @Date: 2023-04-29 16:17
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-29 16:17
 * @Description:
 */

import { onMounted, onBeforeUnmount } from "vue";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

export function drawControl() {
  onMounted(() => {
    map.value.pm?.addControls({
      position: "topleft",
      drawCircle: true,
      drawCircleMarker: false,
      drawMarker: false,
      drawPolygon: true,
      drawPolyline: true,
      drawRectangle: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });
  }),
    onBeforeUnmount(() => {});
}
