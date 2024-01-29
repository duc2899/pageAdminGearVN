import * as APIClient from '../APIClient';
import { Producer_Services } from '../urls';

export const ProducerAPI = {
    getProducer() {
        return APIClient.get(Producer_Services.GET_PRODUCER).then((data) => data.data);
    }
};
