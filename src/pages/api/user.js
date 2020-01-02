import Vue from 'vue';
import axios from './axios';
var API_ROOT = 'http://localhost:8086/'


export const user = {
  login(data) {
    return axios.get(API_ROOT + 'admin/login', data);
  },
  regist(data) {
    return Vue.http.post(API_ROOT + 'admin/regist', data)
  },
  getuserinfo(data) {
    return axios.post(API_ROOT + 'admin/info', data);
  },
}
