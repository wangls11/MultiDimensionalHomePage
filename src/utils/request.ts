import axios from "axios";

const instance = axios.create({
  // baseURL: "https://lijxb8e1.ipyingshe.net/",
  // baseURL: "https://testbasedev.feichuangtech.com/",
  baseURL: "https://basedev.feichuangtech.com/",
  timeout: 1000000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config: any) {
    return config;
  },
  function (error) {
    // 对请求错误做些什么

    return Promise.reject(error);
  }
);

const isRefreshing = false;
const requestList: Array<(token: string) => void> = [];
// 添加响应拦截器
instance.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;

