import * as APIClient from '../APIClient';
import { Chart_Services } from '../urls';

export const ChartMonthAPI = {
    getChartMonth() {
        return APIClient.get(Chart_Services.GET_CHART_MONTH);
    }
};
