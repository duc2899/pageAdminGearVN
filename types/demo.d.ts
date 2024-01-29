/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';
import { List } from 'lodash';

declare namespace Demo {
    type ListProduct = {
        data: Array<Product>;
        pageNo: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
    };
    //ProductService
    type Product = {
        id?: number;
        title: string;
        description: string;
        image?: string;
        saleRate: number;
        oldPrice?: number;
        type?: string;
        quantity?: number;
        producer?: string;
        properties?: Array<Properties>;
        dataFeedback: Array<ProductFeedback>;
        previewImages: Array<PreviewImages>;
    };

    interface ProductRequest {
        title: string;
        oldPrice: number;
        saleRate: number;
        quantity: number;
        idCategory: number;
        idProducer: number;
        description: string;
        properties: any;
    }

    type Properties = {
        id: number;
        properties: string;
        name: string;
        isPublic: boolean;
    };

    type ProductFeedback = {
        star: number;
    };

    type PreviewImages = {
        id: number;
        image: string;
    };

    //CustomerService
    type Customer = {
        id?: number;
        name?: string;
        email: string;
        role: 'USER' | 'ADMIN';
        phoneNumber: string;
        createdAt: string;
        password: string;
        isActive: boolean;
    };
}

declare namespace Category {
    type Category = {
        id: number;
        name: string;
    };
}

declare namespace Producer {
    type Producer = {
        id: number;
        name: string;
    };
}
