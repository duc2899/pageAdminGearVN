import * as APIClient from '../APIClient';
import { Category_Services } from '../urls';

export const CategoryAPI = {
    getCategory() {
        return APIClient.get(Category_Services.GET_CATEGORY).then((data) => data.data);
    }
};
