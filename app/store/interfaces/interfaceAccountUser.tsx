declare namespace InterfaceAccountUser {
    interface AddUser {
        name: String;
        email: String;
        password: String;
        phoneNumber: String;
    }
    interface EditUser {
        id: Number;
        userName: String;
        email: String;
        password: String;
        phoneNumber: String;
        isActive: boolean;
    }
}
