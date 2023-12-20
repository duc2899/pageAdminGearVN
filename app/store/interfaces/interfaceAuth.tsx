declare namespace InterfaceAuth {
    interface LoginRequest {
        name: String;
        password: String;
    }

    interface LoginResponse {
        data: User | null;
        message: String;
        status: Number;
    }

    interface User {
        // accessToken: String;
        name: String;
        id: Number;
        role: String;
        email: String;
        phoneNumber: String;
    }

   
}
