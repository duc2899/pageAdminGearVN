import * as APIClient from '../APIClient';
import { Orders_Services } from '../urls';
type setStatus = {
    idBill: number;
    statusBill: number;
};
export const OrdersAPI = {
    getOrders() {
        return APIClient.get(Orders_Services.GET_ORDERS).then((data) => data.data);
    },
    setStatus(formData: setStatus) {
        return APIClient.update(Orders_Services.CHANGE_STATUS_ORDER, formData);
    }
};
