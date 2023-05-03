/*
 * @Author: Faith
 * @Date: 2023-04-04 14:50
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-10 16:48
 * @Description:
 */
import L from "leaflet";

const HomeControl = L.Control.extend({
  options: {
    position: "topleft"
  },

  onAdd(map: L.Map) {
    const container = L.DomUtil.create(
      "div",
      "leaflet-control-home leaflet-bar leaflet-control"
    );
    const button = L.DomUtil.create("a", "leaflet-control-part", container);
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7H4Z"/></svg>';
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(button, "click", () => {
      if (!map) return;
      const { center, zoom } = map.options;

      map.flyTo(center, zoom);
    });
    return container;
  }
});

L.Control.HomeControl = HomeControl;
L.control.homeControl = HomeControl;

export default HomeControl;
