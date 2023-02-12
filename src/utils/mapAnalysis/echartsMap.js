import echarts from "echarts"
import "echarts/map/js/china"
import "echarts/extension/bmap/bmap"
import { sqlQuery } from "@/utils/analysis"
// import { SuperMap, tiandituTileLayer } from '@supermap/iclient-leaflet'

let map = {}
const china = "http://localhost:8090/iserver/services/map-china400/rest/maps/ChinaDark"
const data = [
  { name: "海门", value: 9 },
  { name: "鄂尔多斯", value: 12 },
  { name: "招远", value: 12 },
  { name: "舟山", value: 12 },
  { name: "齐齐哈尔", value: 14 },
  { name: "盐城", value: 15 },
  { name: "赤峰", value: 16 },
  { name: "青岛", value: 18 },
  { name: "乳山", value: 18 },
]
const geoCoordMap = {
  海门: [121.15, 31.89],
  鄂尔多斯: [109.781327, 39.608266],
  招远: [120.38, 37.35],
  舟山: [122.207216, 29.985295],
  齐齐哈尔: [123.97, 47.33],
  盐城: [120.13, 33.38],
  赤峰: [118.87, 42.28],
  青岛: [120.33, 36.07],
  乳山: [121.52, 36.89],
}
const convertData = function (data) {
  var res = []
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      })
    }
  }
  return res
}
const calcQuakeTimes = function (features) {
  // console.log(features);
  let dateBar = {}
  features.map((item, index) => {
    let date = new Date(item.properties.QUAKEDATE)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    dateBar[year] = dateBar[year] ? dateBar[year] : {}
    if (!dateBar[year][month]) {
      dateBar[year][month] = 1
    } else {
      ++dateBar[year][month]
    }
  })
  console.log(dateBar)
}

const chData = async function (param) {
  const { features } = await sqlQuery("", "2021-11-28")
  // console.log(features);
  calcQuakeTimes(features.features)
  let res = features.features.map(item => {
    return {
      name: item.properties.LOCATION,
      value: [
        parseFloat(item.properties.LNG),
        parseFloat(item.properties.LAT),
        parseFloat(item.properties.CLASS),
      ],
    }
  })
  // console.log(res);
  return res
}

const option = {
  title: {
    text: "全国主要城市空气质量 - 百度地图",
    subtext: "data from PM25.in",
    sublink: "http://www.pm25.in",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  // bmap: {
  //   center: [104.114129, 37.550339],
  //   zoom: 5,
  //   roam: true,
  //   mapStyle: {
  //     styleJson: [
  //       {
  //         featureType: 'water',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#d1d1d1',
  //         },
  //       },
  //       {
  //         featureType: 'land',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#f3f3f3',
  //         },
  //       },
  //       {
  //         featureType: 'railway',
  //         elementType: 'all',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'highway',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#fdfdfd',
  //         },
  //       },
  //       {
  //         featureType: 'highway',
  //         elementType: 'labels',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'arterial',
  //         elementType: 'geometry',
  //         stylers: {
  //           color: '#fefefe',
  //         },
  //       },
  //       {
  //         featureType: 'arterial',
  //         elementType: 'geometry.fill',
  //         stylers: {
  //           color: '#fefefe',
  //         },
  //       },
  //       {
  //         featureType: 'poi',
  //         elementType: 'all',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'green',
  //         elementType: 'all',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'subway',
  //         elementType: 'all',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'manmade',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#d1d1d1',
  //         },
  //       },
  //       {
  //         featureType: 'local',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#d1d1d1',
  //         },
  //       },
  //       {
  //         featureType: 'arterial',
  //         elementType: 'labels',
  //         stylers: {
  //           visibility: 'off',
  //         },
  //       },
  //       {
  //         featureType: 'boundary',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#fefefe',
  //         },
  //       },
  //       {
  //         featureType: 'building',
  //         elementType: 'all',
  //         stylers: {
  //           color: '#d1d1d1',
  //         },
  //       },
  //       {
  //         featureType: 'label',
  //         elementType: 'labels.text.fill',
  //         stylers: {
  //           color: '#999999',
  //         },
  //       },
  //     ],
  //   },
  // },
  series: [
    {
      name: "震级",
      type: "scatter",
      coordinateSystem: "leaflet",
      data: await chData(),
      encode: {
        value: 2,
      },
      symbolSize: function (val) {
        return val[2] * 5
      },
      label: {
        formatter: "{b}",
        position: "right",
        show: false,
      },
      emphasis: {
        label: {
          show: true,
        },
      },
    },
  ],
}

async function init(id) {
  new Promise((resolve, reject) => {
    map = L.map(id, {
      center: [39, 118],
      minZoom: 2,
      maxZoom: 18,
      zoom: 8,
      // crs: L.CRS.TianDiTu_WGS84,
      // layers: [baseMapLayer,MapLabel]
    })
    L.supermap.tiledMapLayer(china).addTo(map)
    L.supermap.echartsLayer(option).addTo(map)
  })
}

export { map }
export default init
