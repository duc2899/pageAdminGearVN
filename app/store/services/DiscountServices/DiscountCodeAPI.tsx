import * as APIClient from '../APIClient';
import { DiscountCode_Services } from '../urls';

export const DiscountCodeAPI = {
    getDiscountCode() {
        return APIClient.get(DiscountCode_Services.GET_DISCOUNT_CODE).then((data) => data.data);
    },
    deleteDiscountCode(id: number) {
        return APIClient.remove(DiscountCode_Services.DELETE_DISCOUNT_CODE, {
            data: {
                id: id
            }
        });
    },
    crateDiscountCode(formData: any) {
        return APIClient.post(DiscountCode_Services.CREATE_DISCOUNT_CODE, formData).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    },
    editDiscountCode(formData: any) {
        return APIClient.update(DiscountCode_Services.EDIT_DISCOUNT_CODE, formData).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    }
};
