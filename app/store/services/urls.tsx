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
