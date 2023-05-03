import L from "leaflet";

const CustomControl = L.Control.Layers.extend({
  options: {
    collapsed: true,
    position: "topright"
  },
  initialize(baseLayers, overlays, options) {
    L.Util.setOptions(this, options);

    this._layerControlInputs = [];
    this._layers = [];
    this._lastZIndex = 0;
    this._handlingClick = false;

    for (const i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (const i in overlays) {
      this._addLayer(overlays[i], i, true);
    }
  },
  onAdd: function (map) {
    this._initLayout(this.options.position);
    this._addMarker();
    this._removeMarker();
    this._update();
    this._map = map;
    map.on("zoomend", this._checkDisabledLayers, this);

    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].layer.on("add remove", this._onLayerChange, this);
    }
    return this._container;
  },
  addBaseLayer(layer, name) {
    this._addLayer(layer, name);
    return this._map ? this._update() : this;
  },
  addOverlay(layer, name) {
    this._addLayer(layer, name, true);
    return this._map ? this._update() : this;
  },
  removeLayer(layer) {
    layer.off("add remove", this._onLayerChange, this);

    const obj = this._getLayer(L.Util.stamp(layer));
    if (obj) {
      this._layers.splice(this._layers.indexOf(obj), 1);
    }
    return this._map ? this._update() : this;
  },
  _initLayout: function (position) {
    const container = L.DomUtil.create("div", `control ${position}`);

    const baseBox = L.DomUtil.create("div", "base-box", container);
    for (const layer of Object.values(this._baseLayers)) {
      const box = L.DomUtil.create("div", "box", baseBox);
      const input = L.DomUtil.create("input", "", box);
      input.type = "radio";
      input.checked = layer === this._activeBaseLayer;
      this._layerControlInputs.push(input);

      const label = L.DomUtil.create("span", "label", box);
      label.textContent = layer.name;
    }

    this._overlaysList = L.DomUtil.create("div", "overlays-box", container);

    this._update();

    this._container = container;
  }
});

export default CustomControl;
