import Vue from 'vue';
import axios from './axios';
var API_ROOT = 'http://localhost:8086'

export const ports = {
  get(url, data) {
    return axios.get(API_ROOT + url, data);
  },
  post(url, data) {
    return axios.post(API_ROOT + url, data);
  },
  delete(url, data) {
    return axios.delete(API_ROOT + url, data);
  },
  put(url, data) {
    return axios.put(API_ROOT + url, data);
  },
}
