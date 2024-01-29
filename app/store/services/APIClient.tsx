import axios from 'axios';
import { SERVER_ENDPOINT } from './urls';

const APIClient = axios.create({
    baseURL: SERVER_ENDPOINT
});

export const get = async (path: any, formData = {}) => {
    const response = await APIClient.get(path, formData);
    return response.data;
};
export const post = async (path: any, formData: any, options = {}) => {
    const response = await APIClient.post(path, formData, options);
    return response.data;
};
export const remove = async (path: any, options = {}) => {
    const response = await APIClient.delete(path, options);
    return response.data;
};
export const update = async (path: any, formData: any, options = {}) => {
    const response = await APIClient.put(path, formData, options);
    return response;
};

export default APIClient;
