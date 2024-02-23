import * as APIAuth from '../APIAuth';
import { CHECK_TOKEN, URL_LOGIN } from '../urls';

export const AuthAccount = {
    login(formData: any) {
        return APIAuth.post(URL_LOGIN, formData).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    },
    checkToken(formData: any) {
        return APIAuth.post(CHECK_TOKEN, formData).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    }
};
