/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';
import { List } from 'lodash';

enum SEX_TYPE {
    MALE,
    FEMALE
}
enum PAYMENT_TYPE {
    COD,
    ONLINE
}

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

    type ProductRequest = {
        title: string;
        oldPrice: Number;
        saleRate: number;
        quantity: number;
        idCategory: number;
        idProducer: number;
        description: string;
        properties: any;
    };

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

declare namespace Orders {
    type OrderProducts = {
        id: number;
        price: number;
        name: string;
        image: string;
        saleRate: number;
        amount: number;
    };
    type OrderResponse = {
        id: number;
        sex: SEX_TYPE;
        address: string;
        createdDate: string;
        isPay: boolean;
        name: string;
        email: string;
        paymentType: PAYMENT_TYPE;
        phoneNumber: string;
        priceDelivery: number;
        totalPrice: number;
        temporaryPrice: number;
        discountPrice: number;
        isCancelOrder: boolean;
        statusBill: number;
        note: string;
        products: Array<OrderProducts>;
    };
}

declare namespace DiscountCode {
    type discountCodeResponse = {
        id: number;
        condition_price: number;
        reduce_price: number;
        expiry: string;
        code: string;
    };
}

declare namespace Feedback {
    type feedbackResponse = {
        idProduct: number;
        id: number;
        product: string;
        user: string;
        image: string;
        message: string;
        star: number;
        createdDate: string;
    };
}

declare namespace Login {
    type loginRequest = {
        email: string;
        password: string;
    };
    type loginResponse = {
        id: number;
        name: string;
        email: string;
        token: string;
    };
}
