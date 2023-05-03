/*
 * @Author: Faith
 * @Date: 2022-04-02 17:08
 * @LastAuthor: Faith
 * @LastEditTime: 2023-04-01 11:54
 * @Description: 超图分析函数
 */
import { Feature, FeatureCollection, Geometry, GeoJSON } from "geojson";
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

const CONFIG = window.BASE_CONFIG;

interface featureResult {
  featureCount?: number;
  featureUriList?: any;
  features?: FeatureCollection;
  succeed?: boolean;
  error?: boolean;
  totalCount?: number;
}
interface ServiceResult {
  result: featureResult;
  object: object;
  type: string;
  element: object;
  error?: object;
}

// 获取数据源集合
async function getDatasourcesName(
  url = CONFIG.BASEURL.dataUrl
): Promise<string[]> {
  try {
    let datasourceNames: string[] = [];
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
          // console.log("aaa", serviceResult);
          reject(serviceResult.error);
        }
        datasourceNames = serviceResult.result.datasourceNames;
        // console.log(datasourceNames)
        resolve(datasourceNames);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取数据集
 * @param datasourceName
 * @param url
 * @returns datasetNames 数据集集合
 */
async function getDatasetsName(
  datasourceName: string,
  url: string = CONFIG.BASEURL.dataUrl
): Promise<string[]> {
  try {
    let datasetNames: string[] = [];
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
            reject(serviceResult.error);
          }
          console.log("aaaa", serviceResult);

          datasetNames = serviceResult.result.datasetNames;
          resolve(datasetNames);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 查询字段信息
 * @param url
 * @returns fieldNames 字段集合
 */
async function getFieldsName(url = CONFIG.BASEURL.dataUrl): Promise<string[]> {
  try {
    let fieldNames: string[] = [];
    const fieldsParam = new FieldParameters({
      datasource: "points",
      dataset: "earthquakePoint"
    });
    return await new Promise((resolve, reject) => {
      new FieldService(url).getFields(fieldsParam, serviceResult => {
        if (serviceResult.type === "processFailed" || serviceResult.error) {
          message(`${serviceResult.error}`, { type: "error", grouping: true });
          reject(serviceResult.error);
          // throw serviceResult.error;
        }
        console.log("aaaa", serviceResult);
        fieldNames = serviceResult.result.fieldNames;
      });
      resolve(fieldNames);
    });
  } catch (err) {
    console.log(err);
  }
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

interface QueryOptions {
  url?: string;
  filter?: string;
  fromIndex?: number;
  toIndex?: number;
  [key: string]: any;
}

/**
 * @description: sql查询
 * @param url 服务链接
 * @param filter sql查询条件表达式
 * @param datasourceName 数据源
 * @param datasetName 数据集
 * @param fromIndex
 * @param toIndex
 * @return FeatureCollection total
 */
async function sqlQuery({
  url = CONFIG.BASEURL.dataUrl,
  filter = "",
  datasourceName = "points",
  datasetName = "quake",
  fromIndex = 0,
  toIndex = 19,
  ...rest
}: QueryOptions = {}): Promise<{ features: FeatureCollection; total: number }> {
  const datasetNames: string[] = [`${datasourceName}:${datasetName}`];
  const sqlParameters: any = {
    queryParameter: {
      name: datasetName,
      attributeFilter: filter
    },
    datasetNames,
    fromIndex,
    toIndex
  };
  Object.assign(sqlParameters, rest);
  const sqlParam = new GetFeaturesBySQLParameters(sqlParameters);
  try {
    return await new Promise((resolve, reject) => {
      new FeatureService(url).getFeaturesBySQL(
        sqlParam,
        (serviceResult: ServiceResult) => {
          if (serviceResult.type === "processFailed" || serviceResult.error) {
            message(`${serviceResult.error}`, {
              type: "error",
              grouping: true
            });
            reject(serviceResult.error);
          } else {
            const featuresObj = serviceResult.result.features;
            const total = serviceResult.result.totalCount;
            if (featuresObj.features.length === 0) {
              message(`未查询到数据`, { type: "error" });
            }
            resolve({ features: featuresObj, total });
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
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
