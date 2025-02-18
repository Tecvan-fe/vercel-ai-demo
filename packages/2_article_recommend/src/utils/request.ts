import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://api.juejin.cn',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器处理错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求失败:', error.message);
    return Promise.reject(error);
  }
);
