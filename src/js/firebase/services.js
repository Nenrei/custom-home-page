import axios from "axios";

const baseURL = "https://custom-home-page-ef08b-default-rtdb.firebaseio.com";
const user = "enmanuel";

export const getWebPages = (categoryId) => {
  return axios.get(`${baseURL}/${user}/webCategories/${categoryId}/webSites.json`).then((response) => {
    if (!response.data) {
      return [];
    }
    return response.data;
  });
};

export const addWebPage = (data, categoryId, callback) => {
  return axios.post(`${baseURL}/${user}/webCategories/${categoryId}/webSites.json`, data).then((response) => {callback()});
};

export const removeWebPage = (id, categoryId, callback) => {
  return axios.delete(`${baseURL}/${user}/webCategories/${categoryId}/webSites/${id}.json`).then((response) => {callback()});
};

export const updateWebPage = (data, id, categoryId, callback) => {
  return axios.put(`${baseURL}/${user}/webCategories/${categoryId}/webSites/${id}.json`, data).then((response) => {callback()});
};




export const getWebCategories = () => {
  return axios.get(`${baseURL}/${user}/webCategories.json`).then((response) => {
    if (!response.data) {
      return [];
    }
    return response.data;
  });
};

export const addWebCategory = (data, callback) => {
  return axios.post(`${baseURL}/${user}/webCategories.json`, data).then((response) => {callback()});
};

export const removeWebCategory = (id, callback) => {
  console.log(`${baseURL}/${user}/webCategories/${id}.json`);
  return axios.delete(`${baseURL}/${user}/webCategories/${id}.json`).then((response) => {callback()});
};

export const updateWebCategory = (data, id, callback) => {
  return axios.put(`${baseURL}/${user}/webCategories/${id}.json`, data).then((response) => {callback()});
};
