export const SERVER_ENDPOINT = 'http://localhost:8080/api/private/admin';
export const AUTH_ACCOUNT = 'http://localhost:8080/api/public';
export const URL_LOGIN = '/auth/login/admin';
export const URL_LOGOUT = '/auth/logout';

export enum Account_Services {
    GET_LIST_USERS = '/accountUsers',
    EDIT_USER = '/accountUsers',
    DELETE_USER = '/accountUsers/',
    ADD_USER = '/accountUsers',
    CHECK_EMAIL = '/accountUsers/'
}

export enum Product_Services {
    GET_PRODUCT = '/product',
    ADD_PRODUCT = '/product',
    REMOVE_PRODUCT = '/product',
    EDIT_PRODUCT = '/product',
    POST_IMAGE = '/product/uploadImage',
    POST_PREVIEW_IMAGE = '/product/uploadPreviewImage'
}

export enum Category_Services {
    GET_CATEGORY = '/category',
    ADD_CATEGORY = '/category'
}

export enum Producer_Services {
    GET_PRODUCER = '/producer',
    ADD_PRODUCER = '/producer'
}

export enum Orders_Services {
    GET_ORDERS = '/bill',
    CHANGE_STATUS_ORDER = '/bill/editStatus'
}

export enum DiscountCode_Services {
    GET_DISCOUNT_CODE = '/discountCode',
    CREATE_DISCOUNT_CODE = '/discountCode',
    EDIT_DISCOUNT_CODE = '/discountCode',
    DELETE_DISCOUNT_CODE = '/discountCode'
}
export enum Feedback_Services {
    GET_ALL_FEEDBACK = '/feedbackProduct',
    DELETE_FEEDBACK = '/feedbackProduct'
}
