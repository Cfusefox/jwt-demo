import axios from 'axios'
import { getToken } from '../utils/localStorage'
import { GET } from "../utils/http";

export function login(message) {
  return axios({
    method: 'post',
    url: 'http://localhost:8088/login',
    data: message
  })
}

export function test() {
  return axios({
    method: 'get',
    url: 'http://localhost:8088/index',
    headers: {
      'Token': getToken()
    }
  })
}
