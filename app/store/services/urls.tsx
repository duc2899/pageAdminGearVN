export const SERVER_ENDPOINT = 'http://localhost:8080/api/private/admin';

export const URL_LOGIN = '/public/auth/admin/login';
export const URL_LOGOUT = '/public/auth/logout';

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
    EDIT_PRODUCT = '/product'
}

export enum Category_Services {
    GET_CATEGORY = '/category',
    ADD_CATEGORY = '/category'
}

export enum Producer_Services {
    GET_PRODUCER = '/producer',
    ADD_PRODUCER = '/producer'
}
