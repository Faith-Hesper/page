/*
 * @Author: Faith
 * @Date: 2022-04-02 17:08
 * @LastAuthor: Faith
 * @LastEditTime: 2023-02-12 13:38
 * @Description: 超图分析函数
 */

import { message } from "@/utils/message";
import {
  DatasourceService,
  DatasetService,
  FieldService,
  FieldParameters,
  FeatureService,
  GetFeaturesBySQLParameters,
  DatasetBufferAnalystParameters,
  FilterParameter,
  BufferSetting,
  BufferEndType,
  SpatialAnalystService
} from "@supermap/iclient-leaflet";

const CONFIG: BASE_CONFIG = BASE_CONFIG;

// 获取数据源集合
async function getDatasourcesName(url = CONFIG.BASEURL.dataUrl) {
  return await new Promise((resolve, reject) => {
    new DatasourceService(url).getDatasources(serviceResult => {
      if (serviceResult.type === "processFailed" || serviceResult.error) {
        message(`${serviceResult.error}`, { type: "error", grouping: true });
        // ElMessage({
        //   showClose: true,
        //   message: `${serviceResult.error}`,
        //   offset: 50,
        //   grouping: true,
        //   type: "error",
        // })
        reject(serviceResult.error);
      }
      const datasourceNames = serviceResult.result.datasourceNames;
      // console.log(datasourceNames)
      resolve(datasourceNames);
    });
  }).catch(err => console.log(err));
}

// 获取数据集
async function getDatasetsName(
  datasourceName: string,
  url: string = CONFIG.BASEURL.dataUrl
) {
  return await new Promise((resolve, reject) => {
    new DatasetService(url).getDatasets(
      datasourceName,
      function (serviceResult: {
        type: string;
        error: any;
        result: { datasetNames: string[] };
      }) {
        if (serviceResult.type === "processFailed" || serviceResult.error) {
          message(`${serviceResult.error}`, { type: "error" });

          // ElMessage({
          //   showClose: true,
          //   message: `${serviceResult.error}`,
          //   offset: 50,
          //   grouping: true,
          //   type: "error",
          // })
          reject(serviceResult.error);
        }
        const datasetNames: string[] = serviceResult.result.datasetNames;
        resolve(datasetNames);
      }
    );
  }).catch(err => console.log(err));
}

// 查询字段信息
async function getFieldsName(url = CONFIG.BASEURL.dataUrl) {
  const fieldsParam = new FieldParameters({
    datasource: "points",
    dataset: "earthquakePoint"
  });
  return await new Promise((resolve, reject) => {
    new FieldService(url).getFields(fieldsParam, (serviceResult) => {
      if (serviceResult.type === "processFailed" || serviceResult.error) {
        message(`${serviceResult.error}`, { type: "error", grouping: true });

        // ElMessage({
        //   showClose: true,
        //   message: `${serviceResult.error}`,
        //   offset: 50,
        //   grouping: true,
        //   type: "error",
        // })
        reject(serviceResult.error);
      }
      resolve(serviceResult.result.fieldNames);
    });
  }).catch(err => console.log(err));
}

// 日期
// async function dateSelect(param) {
//   const result = await sqlQuery("", "", "Date_User")
//   console.log("1", result)
//   datasetsSelect = document.getElementById("dateSelect")
//   for (let i = 0, len = result.length; i < len; i++) {
//     datasetsSelect.options[i] = new Option(result[i], result[i])
//   }
// }

/**
 * @description: sql查询
 * @param url 服务链接
 * @param filter sql查询条件表达式
 * @param datasourceName 数据源
 * @param datasetName 数据集
 * @param fromIndex
 * @param toIndex
 * @return features total
 */
async function sqlQuery({
  url = CONFIG.BASEURL.dataUrl,
  filter = "",
  datasourceName = "points",
  datasetName = "quake",
  fromIndex = 0,
  toIndex = 19
} = {}) {
  const datasetNames = [datasourceName + ":" + datasetName];
  console.log(datasetNames, datasourceName, datasetName);

  //
  const sqlParameters = {
    queryParameter: {
      name: datasetName,
      attributeFilter: filter
    },
    datasetNames: datasetNames,
    fromIndex: fromIndex,
    toIndex: toIndex
  };
  Object.assign(sqlParameters, ...arguments);
  console.log(sqlParameters);
  const sqlParam = new GetFeaturesBySQLParameters(sqlParameters);
  return await new Promise((resolve, reject) => {
    new FeatureService(url).getFeaturesBySQL(sqlParam, (serviceResult) => {
      if (serviceResult.type === "processFailed" || serviceResult.error) {
        message(`${serviceResult.error}`, { type: "error", grouping: true });

        // ElMessage({
        //   showClose: true,
        //   message: `${serviceResult.error}`,
        //   offset: 50,
        //   grouping: true,
        //   type: "error",
        // })
        reject(serviceResult.error);
      } else {
        const features = serviceResult.result.features;
        const total = serviceResult.result.totalCount;
        if (features.lenth === 0) {
          message(`未查询到数据`, { type: "error" });

          // ElMessage({
          //   showClose: true,
          //   message: `未查询到数据`,
          //   offset: 50,
          //   grouping: true,
          //   type: "warning",
          // })
        }
        resolve({ features: features, total: total });
      }
    });
  });
}

// 缓冲区分析
async function buffer_Analysis() {
  // 缓冲区分析参数
  const butterflyAnalystParams = new DatasetBufferAnalystParameters({
    dataset: "earthquakePoint@points",
    filterQueryParameter: new FilterParameter({
      attributeFilter: "class>='6.1'",
      name: "earthquakePoint@points"
    }),
    bufferSetting: new BufferSetting({
      endType: BufferEndType.ROUND,
      leftDistance: { value: 2 },
      rightDistance: { value: 2 },
      semicircleLineSegment: 10
    })
  });

  // 分析
  return await new Promise((resolve, reject) => {
    new SpatialAnalystService(CONFIG.BASEURL.spatialAnalystUrl).bufferAnalysis(
      butterflyAnalystParams,
      serviceResult => {
        if (serviceResult.type === "processFailed" || serviceResult.error) {
          message(`${serviceResult.error}`, { type: "error", grouping: true });

          // ElMessage({
          //   showClose: true,
          //   message: `${serviceResult.error}`,
          //   offset: 50,
          //   grouping: true,
          //   type: "error",
          // })
          reject(serviceResult.error);
        }
        // L.geoJSON(serviceResult.result.recordset.features).addTo(map)
        console.log(serviceResult.result);
        resolve(serviceResult.result);
      }
    );
  }).catch(err => console.log(err));
}

export {
  getDatasourcesName,
  getDatasetsName,
  getFieldsName,
  buffer_Analysis,
  sqlQuery
};
