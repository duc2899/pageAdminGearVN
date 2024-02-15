import * as APIClient from '../APIClient';
import { Product_Services } from '../urls';
export const ProductAPi = {
    getProduct(formData: any) {
        return APIClient.get(Product_Services.GET_PRODUCT, {
            params: formData
        }).then((data) => data.data);
    },
    addProduct(formData: any, type: String) {
        return APIClient.post(Product_Services.ADD_PRODUCT + `/add${type}Product`, {
            ...formData
        });
    },
    sendImage(formData: any, id: number) {
        return APIClient.post(Product_Services.POST_IMAGE + `/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    sendImagePreview(formData: any, id: number) {
        return APIClient.post(Product_Services.POST_PREVIEW_IMAGE + `/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
