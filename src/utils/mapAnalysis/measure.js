/*
 * @Author: Faith
 * @Date: 2022-11-11 15:46
 * @LastAuthor: Faith
 * @LastEditTime: 2022-11-11 15:46
 * @Description:
 */
;(function (win, doc) {
  /**
   *
   * @param {ol.map} map 地图对象
   * @param {ol.layer} measureLayer //量算要素矢量图层
   * @param {Object} options //参数  target：目标元素,
   *                            placement：位置(top-left, top-right, bottom-left, bottom-right),
   *                            top || right || bottom || left：位置微调
   *                            projection：投影坐标系(EPSG:4326, EPSG: 3857)
   *                            language：语言类型(en-US, zh-CN),传递语言对象
   */
  let MeasureTool = function (map, measureLayer, options) {
    let defaults = {
      target: doc.getElementsByTagName("body")[0],
      placement: "top-right",
      projection: "EPSG:4326",
    }
    this.map = map //必须
    this.measureLayer = measureLayer //必须
    this.options = Object.assign({}, defaults, options)
    this.lang = this.getLang() //组件中英文语言配置

    this.draw = null //绘图控件
    this.sketch = null //当前绘制要素类别（线、面）
    this.measureTooltipElement = null //结果DOM
    this.measureTooltip = null //结果OverLay
    this.helpTooltipElement = null
    this.helpTooltip = null
    this.output = "" //测量结果
    this.count = 0 //要素数量
    this.remainCount = 0 //剩余要素数量
    this.isStart = true //是否第一个点
    this.zIndex = 1 //OverLay层级
    this.measureSource = [] //数据源
    this.measureFeatureArr = [] //要素集
    this.measureFeatureItemArr = [] //要素
    this.measureInfoArr = [] //测量结果信息集
    this.measureInfoItemArr = [] //测量结果信息
    this.isDrawEnd = true //绘制是否结束
    this.clearBtnEnable = false //清除按钮是否可用
  }
  MeasureTool.prototype = {
    /**
     * 初始化
     */
    init: function () {
      //渲染dom
      this.renderDOM()
      //事件绑定
      this.bindEvent()
    },

    getLang: function () {
      return Object.assign(
        {
          mapMeasure: "地图量算",
          distanceMeasure: "测距离",
          areaMeasure: "测面积",
          clearMeasure: "清除",
          clearCurrentMeasure: "清除量算结果",
          helpInfo: "单击左键添加点，双击结束",
          totalDistance: "总距离",
          totalArea: "总面积",
          startPoint: "起点",
        },
        this.options.language
      )
    },

    /**
     * 事件绑定
     */
    bindEvent: function () {
      let measureBtn = this.getElmByClass("measure")[0],
        closeBtn = this.getElmByClass("close")[0],
        lineStringBtn = this.getElmByClass("lineStringBtn")[0],
        polygonBtn = this.getElmByClass("polygonBtn")[0],
        clearBtn = this.getElmByClass("clearBtn")[0]

      measureBtn.addEventListener("click", this.showMeasurePanel.bind(this))
      closeBtn.addEventListener("click", this.closeMeasurePanel.bind(this))
      lineStringBtn.addEventListener("click", this.drawMeasure.bind(this, "LineString"))
      polygonBtn.addEventListener("click", this.drawMeasure.bind(this, "Polygon"))
      clearBtn.addEventListener("click", this.clearMeasure.bind(this, true))

      this.map && this.registerMapEvent()
    },

    /**
     * 显示量算工具
     */
    showMeasurePanel: function () {
      let measurePanel = this.getElmByClass("measurePanel")[0]
      measurePanel.classList.add("measurePanel-show")
      let measureBtn = this.getElmByClass("measure")[0]
      measureBtn.style.display = "none"
    },

    /**
     * 关闭量算工具
     */
    closeMeasurePanel: function () {
      let measurePanel = this.getElmByClass("measurePanel")[0]
      measurePanel.classList.remove("measurePanel-show")
      let measureBtn = this.getElmByClass("measure")[0]
      measureBtn.style.display = ""
      this.clearMeasure(false)
    },

    /**
     * 更新量算按钮状态
     * @param {String} measureType 量算类型
     * @param {Boolean} isEnable 清除按钮是否可用
     */
    updateMeasureBtnStatus: function (measureType, isEnable) {
      let lineStringBtn = this.getElmByClass("lineStringBtn")[0],
        polygonBtn = this.getElmByClass("polygonBtn")[0],
        clearBtn = this.getElmByClass("clearBtn")[0]
      if (measureType === "LineString") {
        lineStringBtn.classList.add("measureBtn-active")
        polygonBtn.classList.remove("measureBtn-active")
      } else if (measureType === "Polygon") {
        polygonBtn.classList.add("measureBtn-active")
        lineStringBtn.classList.remove("measureBtn-active")
      } else {
        polygonBtn.classList.remove("measureBtn-active")
        lineStringBtn.classList.remove("measureBtn-active")
      }

      if (isEnable !== undefined && isEnable !== null) {
        if (isEnable) {
          clearBtn.classList.add("clearBtn-enable")
          clearBtn.classList.remove("clearBtn-disable")
        } else {
          clearBtn.classList.add("clearBtn-disable")
          clearBtn.classList.remove("clearBtn-enable")
        }
        this.clearBtnEnable = isEnable
      }
    },

    /**
     * 添加绘图控件到map上
     * @param {String} measureType 绘制类型  线、面
     */
    addInteraction: function (measureType) {
      this.measureSource = this.measureLayer.getSource()
      this.draw = new ol.interaction.Draw({
        source: this.measureSource,
        type: measureType,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: "rgba(255,255,255,0.35)", //绘制时面的填充的颜色
          }),
          stroke: new ol.style.Stroke({
            color: "#0081E2",
            lineDash: [10, 10],
            width: 2,
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: "#0081E2",
              width: 2,
            }),
            fill: new ol.style.Fill({
              color: "rgba(255,255,255,1)",
            }),
          }),
        }),
      })
      this.map.addInteraction(this.draw)
    },

    /**
     * 鼠标移动添加提示信息
     */
    pointerMoveHandler: function (evt) {
      if (this.isDrawEnd) return
      if (evt.dragging) {
        return
      }
      this.helpTooltipElement.innerHTML = "<p>" + this.lang.helpInfo + "</p>"
      this.helpTooltip.setPosition(evt.coordinate)
    },

    /**
     * 初始化量算工具
     */
    initMeasure: function () {
      if (!this.isDrawEnd) {
        for (let i = 0, len = this.measureInfoItemArr.length; i < len; i++) {
          this.map.removeOverlay(this.measureInfoItemArr[i])
        }
        for (let j = 0, len1 = this.measureFeatureItemArr.length; j < len1; j++) {
          this.measureSource.removeFeature(this.measureFeatureItemArr[j])
        }
      }
      // this.map.removeEventListener('pointermove');
      // this.map.removeEventListener('singleclick');
      this.map.removeInteraction(this.draw)
      this.measureFeatureItemArr = []
      this.measureInfoItemArr = []
      this.isStart = true
      this.isDrawEnd = true
    },

    /**
     * 注册地图事件
     */
    registerMapEvent: function () {
      let me = this
      me.map.addEventListener("pointermove", this.pointerMoveHandler.bind(this))

      me.map.addEventListener("singleclick", function (evt) {
        if (me.isDrawEnd) return
        let coordinate = evt.coordinate
        let point = new ol.geom.Point(coordinate)
        let featurePoint = new ol.Feature(point)
        me.measureSource.addFeature(featurePoint)
        me.measureFeatureItemArr.push(featurePoint)
        me.measureTooltipElement.innerHTML = '<span class="tooltip-measure">' + me.output + "</span>"
        if (me.measureType === "LineString") {
          if (me.isStart) {
            me.measureTooltipElement.innerHTML = '<span class="tooltip-measure">' + me.lang.startPoint + "</span>"
            me.measureInfoItemArr.push(me.measureTooltip)
          }
          me.measureTooltip.setPosition(coordinate)
          me.createMeasureTooltip()
        }
        me.isStart = false
        me.measureInfoItemArr.push(me.measureTooltip)
      })
    },

    /**
     * 绘制测量主函数
     * @param {String} measureType 绘制类型  线、面
     */
    drawMeasure: function (measureType) {
      //进入量算
      window.DataViz.isMeasure = true
      this.isDrawEnd = false
      this.initMeasure()
      this.updateMeasureBtnStatus(measureType)
      this.addInteraction(measureType)
      this.createMeasureTooltip()
      this.createHelpTooltip()
      this.measureType = measureType
      let me = this
      let lastPoint = null
      let type = ""
      let listener //事件监听
      this.draw.on("drawstart", function (evt) {
        me.isDrawEnd = false
        me.map.getInteractions().item(1).setActive(false) //清除双击缩放
        me.sketch = evt.feature
        let tooltipCoord = evt.coordinate

        listener = me.sketch.getGeometry().on("change", function (evt) {
          const geom = evt.target
          if (geom instanceof ol.geom.Polygon) {
            me.output = me.formatArea(geom)
            // tooltipCoord = geom.getInteriorPoint().getCoordinates();
            type = me.lang.totalArea
          } else if (geom instanceof ol.geom.LineString) {
            me.output = me.formatLength(geom)
            tooltipCoord = geom.getLastCoordinate()
            type = me.lang.totalDistance
          }
          me.helpTooltipElement.innerHTML =
            "<span>" + type + ' :</span><span class="tooltip-help">' + me.output + "</span>" + "<p>" + me.lang.helpInfo + "</p>"

          // me.helpTooltip.setPosition(tooltipCoord);
          lastPoint = tooltipCoord
        })
      })

      this.draw.on(
        "drawend",
        function (evt) {
          let point, featurePoint
          let feature = evt.feature
          let points = feature.getGeometry().getCoordinates()
          let endPoint = points[0][points[0].length - 2]
          let currentCount = me.count

          if (measureType === "LineString") {
            point = new ol.geom.Point(lastPoint)
            featurePoint = new ol.Feature(point)
            me.measureSource.addFeature(featurePoint)
            me.measureTooltip.setPosition(lastPoint)
            type = me.lang.totalDistance
          } else if (measureType === "Polygon") {
            point = new ol.geom.Point(endPoint)
            featurePoint = new ol.Feature(point)
            me.measureSource.addFeature(featurePoint)
            me.measureTooltip.setPositioning("bottom-center")
            me.measureTooltip.setPosition(feature.getGeometry().getInteriorPoint().getCoordinates())
            type = me.lang.totalArea
          }

          me.measureFeatureItemArr.push(feature)
          me.measureFeatureItemArr.push(featurePoint)
          me.measureFeatureArr.push(me.measureFeatureItemArr)

          me.measureTooltipElement.innerHTML =
            '<span class="tooltip-measure">' +
            type +
            ' : <strong class="strong">' +
            me.output +
            "</strong>" +
            "</span>" +
            '<a id="clear_' +
            currentCount +
            '" ' +
            'class="supermapol-icons supermapol-icons-close tooltip-clear"' +
            'title="' +
            me.lang.clearCurrentMeasure +
            '"></a>'
          me.measureTooltipElement.style.zIndex = me.count + 1
          me.measureInfoItemArr.push(me.measureTooltip)
          me.measureInfoArr.push(me.measureInfoItemArr)
          //给每个要素显示的清除按钮添加监听事件
          document.getElementById("clear_" + currentCount).addEventListener("click", function () {
            if (me.remainCount > 0) {
              me.remainCount--
            }
            let featureArr = me.measureFeatureArr[currentCount]
            for (let i = 0, len = featureArr.length; i < len; i++) {
              me.measureSource.removeFeature(featureArr[i])
            }
            let infoArr = me.measureInfoArr[currentCount]
            for (let j = 0, len = infoArr.length; j < len; j++) {
              me.map.removeOverlay(infoArr[j])
            }
            me.measureFeatureArr[currentCount] = []
            me.measureInfoArr[currentCount] = []
            //量算图层上剩余要素为0时，清除按钮不可用
            if (me.remainCount === 0) {
              me.updateMeasureBtnStatus(null, false)
            }
          })

          me.isDrawEnd = true
          me.sketch = null
          me.output = null
          me.measureFeatureItemArr = []
          me.measureTooltipElement = null
          me.helpTooltipElement = null
          //移除listener监听事件
          ol.Observable.unByKey(listener)
          me.map.removeOverlay(me.helpTooltip)
          //初始化量算工具
          me.initMeasure()
          me.updateMeasureBtnStatus(null, true)
          me.count++
          me.remainCount++
          setTimeout(function () {
            me.map.getInteractions().item(1).setActive(true) //清除双击缩放
            window.DataViz.isMeasure = false //退出量算
          }, 100)
        },
        this
      )
    },

    /**
     * 清除绘制的要素和OverLay
     * @param {Boolean} isClearClick 是否点击清除按钮
     */
    clearMeasure: function (isClearClick) {
      if (!this.clearBtnEnable && isClearClick) {
        return
      }
      if (isClearClick) {
        if (this.measureFeatureArr) {
          for (let i = 0; i < this.measureFeatureArr.length; i++) {
            for (let j = 0; j < this.measureFeatureArr[i].length; j++) {
              this.measureSource.removeFeature(this.measureFeatureArr[i][j])
            }
          }
        }
        if (this.measureInfoArr) {
          for (let i = 0; i < this.measureInfoArr.length; i++) {
            for (let j = 0; j < this.measureInfoArr[i].length; j++) {
              this.map.removeOverlay(this.measureInfoArr[i][j])
            }
          }
        }
        this.count = 0
        this.remainCount = 0
        this.measureFeatureArr = []
        this.measureInfoArr = []
      }
      //禁用清除按钮,量算按钮恢复默认状态
      this.updateMeasureBtnStatus(null, this.remainCount > 0)

      if (this.helpTooltip) {
        this.map.removeOverlay(this.helpTooltip)
      }

      this.sketch = null
      this.measureTooltipElement = null
      this.measureTooltip = null
      this.helpTooltipElement = null
      this.helpTooltip = null
      this.output = null
      //退出量算
      window.DataViz.isMeasure = false
      //初始化量算工具
      this.initMeasure()
    },

    /**
     * 创建帮助信息显示的OverLay
     */
    createHelpTooltip: function () {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
      }
      this.helpTooltipElement = document.createElement("div")
      this.helpTooltipElement.className = "tooltip"
      this.helpTooltipElement.style.zIndex = this.count + 2
      this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      })
      this.map.addOverlay(this.helpTooltip)
    },

    /**
     * 创建测量结果显示的OverLay
     */
    createMeasureTooltip: function () {
      this.measureTooltipElement = document.createElement("div")
      this.measureTooltipElement.className = "tooltip"
      this.measureTooltipElement.style.zIndex = this.count
      this.measureTooltip = new ol.Overlay({
        element: this.measureTooltipElement,
        offset: [5, -5],
        positioning: "bottom-left",
      })
      this.map.addOverlay(this.measureTooltip)
    },

    /**
     * 距离测量
     * @param {Geometry} line 线
     */
    formatLength: function (line) {
      const length = ol.sphere.getLength(line, { projection: this.options.projection })
      let output
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km"
      } else {
        output = Math.round(length * 100) / 100 + " " + "m"
      }
      return output
    },

    /**
     * 面积测量
     * @param {Geometry} polygon 面
     */
    formatArea: function (polygon) {
      const area = ol.sphere.getArea(polygon, { projection: this.options.projection })
      let output
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>"
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>"
      }
      return output
    },

    //
    /**
     * 根据类名获取元素
     * @param {String} className 类名
     */
    getElmByClass: function (className) {
      return this.options.target.getElementsByClassName(className)
    },

    /**
     * 渲染dom
     */
    renderDOM: function () {
      //总div
      let measureTool = doc.createElement("div")
      measureTool.className = "measureTool " + this.options.placement
      if (this.options.top) {
        measureTool.style.marginTop = this.options.top
      }
      if (this.options.right) {
        measureTool.style.marginRight = this.options.right
      }
      if (this.options.left) {
        measureTool.style.marginLeft = this.options.left
      }
      if (this.options.bottom) {
        measureTool.style.marginBottom = this.options.bottom
      }

      let tmp =
        "" +
        '<a class="supermapol-icons supermapol-icons-measure measure" title=' +
        this.lang.mapMeasure +
        "></a>" +
        '<div class="measurePanel ' +
        this.options.placement +
        '">' +
        '<div class="measurePanel-title">' +
        '<i class="supermapol-icons supermapol-icons-measure"></i>' +
        "<span>" +
        this.lang.mapMeasure +
        "</span>" +
        '<a class="supermapol-icons supermapol-icons-close close"></a>' +
        "</div>" +
        '<div class="measurePanel-content">' +
        '<a class="lineStringBtn">' +
        this.lang.distanceMeasure +
        "</a>" +
        '<a class="polygonBtn">' +
        this.lang.areaMeasure +
        "</a>" +
        '<a class="clearBtn clearBtn-disable">' +
        this.lang.clearMeasure +
        "</a>" +
        "</div>" +
        "</div>"

      measureTool.innerHTML = tmp
      this.options.target.appendChild(measureTool)
    },
  }

  window.MeasureTool = MeasureTool
})(window, document)
