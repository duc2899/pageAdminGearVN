import * as APIClient from '../APIClient';
import { Feedback_Services } from '../urls';

export const FeedbackAPI = {
    getAllFeedback() {
        return APIClient.get(Feedback_Services.GET_ALL_FEEDBACK);
    },
    deleteFeedback(formData: any) {
        return APIClient.remove(Feedback_Services.DELETE_FEEDBACK, {
            data: {
                ...formData
            }
        }).catch((error) => {
            if (error?.response?.status !== 200 || error?.response?.status !== 201) {
                return error?.response?.data;
            }
        });
    }
};
