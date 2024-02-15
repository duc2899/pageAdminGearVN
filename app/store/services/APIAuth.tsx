import axios from 'axios';
import { AUTH_ACCOUNT } from './urls';

const APIAuth = axios.create({
    baseURL: AUTH_ACCOUNT
});

export const post = async (path: any, formData: any, options = {}) => {
    const response = await APIAuth.post(path, formData, options);
    return response.data;
};

export default APIAuth;
