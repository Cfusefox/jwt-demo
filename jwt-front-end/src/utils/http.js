import Axios from 'axios'
// https://github.com/axios/axios
import { getToken } from '../utils/localStorage'
const request = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3000,
  validateStatus: function (status) {
    return status >= 200 && status < 300 // default
  }
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  if(getToken()) {
    config.headers.common['token'] = getToken();
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  return response.data
}, async function (error) {
  return Promise.reject(error)
})

export const GET = (url, params) => request.get(url, { params })
export const POST = request.post
export const PUT = request.put
export const DELETE = (url, params) => request.delete(url, { params })
export const PATCH = request.patch

// todo upload file
export default {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH
}
