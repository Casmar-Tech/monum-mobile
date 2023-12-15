import axios from 'axios';

export const resReqApi = axios.create({
  baseURL: 'https://reqres.in/api',
});
