import { Demo } from '../../../../types/demo';
import * as APIClient from '../APIClient';
import { Account_Services } from '../urls';

export const AccountAPi = {
    getListUsers() {
        return APIClient.get(Account_Services.GET_LIST_USERS).then((d) => d.data as Demo.Customer[]);
    },
    addUser(data: InterfaceAccountUser.AddUser) {
        return APIClient.post(Account_Services.ADD_USER, data);
    },
    checkEmail(data: String) {
        return APIClient.get(Account_Services.CHECK_EMAIL + data);
    },
    deleteUser(id: Number) {
        return APIClient.remove(Account_Services.DELETE_USER + id);
    },
    editUser(data: InterfaceAccountUser.EditUser) {
        return APIClient.update(Account_Services.EDIT_USER, data);
    }
};
