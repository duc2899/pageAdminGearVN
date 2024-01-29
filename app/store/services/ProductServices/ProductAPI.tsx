import * as APIClient from '../APIClient';
import { Product_Services } from '../urls';
export const ProductAPi = {
    getProduct(formData: any) {
        return APIClient.get(Product_Services.GET_PRODUCT, {
            params: formData
        }).then((data) => data.data);
    }
};
