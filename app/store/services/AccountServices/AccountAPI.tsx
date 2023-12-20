import { Demo } from '../../../../types/demo';
import APIClient from '../APIClient';
import { Account_Services } from '../urls';

export const AccountAPi = {
    getListUsers() {
        return APIClient.get(Account_Services.GET_LIST_USERS).then((d) => d.data.data as Demo.Customer[]);
    },
    addUser(data: InterfaceAccountUser.AddUser) {
        return APIClient.post(Account_Services.ADD_USER, data);
    },
    checkEmail(data: String) {
        return APIClient.get(Account_Services.CHECK_EMAIL + data);
    },
    deleteUser(id: Number) {
        return APIClient.delete(Account_Services.DELETE_USER + id);
    },
    editUser(data: InterfaceAccountUser.EditUser) {
        return APIClient.put(Account_Services.EDIT_USER, data);
    }
};
