import * as APIAuth from '../APIAuth';
import { URL_LOGIN } from '../urls';

export const AuthAccount = {
    login(formData: any) {
        return APIAuth.post(URL_LOGIN, formData).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    }
};
