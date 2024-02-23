import { createContext, useEffect, useState } from 'react';
import { ChildContainerProps } from '../../types/types';
import { Login } from '../../types/demo';
import GetCookie from '../../app/(main)/utilities/cookies/getCookie';
import { useRouter } from 'next/navigation';
import { AuthAccount } from '../../app/store/services/AuthServices/AuthAccountAPI';

export const AccountContext = createContext({} as any);

export const AccountProvider = ({ children }: ChildContainerProps) => {
    const [user, setUser] = useState<Login.loginResponse>();

    const [isLogin, setIsLogin] = useState<boolean>(false);
    const router = useRouter();
    const value = {
        user,
        isLogin,
        setIsLogin
    };

    useEffect(() => {
        if (GetCookie('user')) {
            setUser(GetCookie('user'));
            AuthAccount.checkToken({ token: GetCookie('user').token }).then((d) => {
                if (d.status === 200) {
                    router.push('/');
                } else {
                    router.push('/auth/login');
                }
            });
        } else {
            router.push('/auth/login');
        }
    }, [router]);
    return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
