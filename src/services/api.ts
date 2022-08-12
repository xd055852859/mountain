import axios from "axios";
import { ElMessage } from "element-plus";
// import i18n from "@/language/i18n";
import qs from "qs";
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const API_URL = import.meta.env.VITE_API_URL;
let token = localStorage.getItem("token") || "";
let domainKey = "";
let regionCode = "";
let message = true;
axios.interceptors.request.use(
  (config: any) => {
    if (
      config.url.indexOf("client/byDomain") === -1 &&
      config.url.indexOf("geo.datav.aliyun.com") === -1
    ) {
      if (config.method === "get") {
        if (!config.params) {
          config.params = {};
        }
        config.params.token = token;
        config.params.clientKey = domainKey;
        if (!config.params.regionCode) {
          config.params.regionCode = regionCode;
        }
        // config.params = qs.stringify({
        //   ...config.params,
        // });
      } else {
        let data = qs.parse(config.data);
        data.token = token;
        config.data = {
          token: token,
          clientKey: domainKey,
          regionCode: regionCode,
          ...data,
        };
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.status === 701 && message) {
      message = false;
      ElMessage({
        message: "Please login",
        type: "error",
        duration: 1000,
      });
      localStorage.removeItem("token");
    } else if (response.data.status === 201) {
      ElMessage({
        message: response.data.msg,
        type: "error",
        duration: 1000,
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const request = {
  get(path: string, params?: object, otherUrl?: boolean, otherPath?: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "get",
          url: otherPath
            ? otherPath
            : otherUrl
            ? AUTH_URL + path
            : API_URL + path,
          params: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  post(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "post",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  patch(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "patch",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "delete",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default {
  request,
  setToken: (_token: string) => {
    token = _token;
  },
  setDomainKey: (_domainKey: string) => {
    domainKey = _domainKey;
  },
  setRegionCode: (_regionCode: string) => {
    regionCode = _regionCode;
  },
};
