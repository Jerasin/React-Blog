import axios from "axios";
import join from "url-join";
import {
  server,
  apiUrl,
  NOT_CONNECT_NETWORK,
  NETWORK_CONNECTION_MESSAGE,
} from "./../Constatns";

// Regular Endpoint
const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config) => {
    // เช็คว่าใส่ Endpoint เต็มหรือย่อ ถ้าย่อจะเติมให้เต็ม
    
  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = join(apiUrl, config.url);
    
  }
  console.log(config.url)
  // console.log(config.url)
  // เช็คว่า Endpoint ที่ Req มาตรงกับ Route Login หรือถ้าไม่ตรงกับ Login ให้เช็ค token ก่อน
  if (config.url !== apiUrl + server.LOGIN_URL) {
    const token = JSON.parse(localStorage.getItem("localStorageID"))
    config.headers.Authorization = token ? "Bearer" + " " + token: "";
  }
  config.timeout = 10000; // 10 Second
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // debugger
    // console.log(JSON.stringify(error, undefined, 2));
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    } else if (!error.response) {
      return Promise.reject({
        code: NOT_CONNECT_NETWORK,
        message: NETWORK_CONNECTION_MESSAGE,
      });
    }
    return Promise.reject(error);
  }
);

export const httpClient = axios;
