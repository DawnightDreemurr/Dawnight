import axios from 'axios'

const server = axios.create({
  baseURL: '/api', // API 主机地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json' // 默认请求头
  }
})
// 请求拦截器
server.interceptors.request.use(
  (config) => {
    // 你可以在这里修改请求配置
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
server.interceptors.response.use(
  (response) => {
    // 响应数据处理
    return response.data;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export { server };
