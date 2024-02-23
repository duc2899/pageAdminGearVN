/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';
import { Login } from '../../../../types/demo';
import { Toast } from 'primereact/toast';
import { AuthAccount } from '../../../store/services/AuthServices/AuthAccountAPI';
import SetCookie from '../../../(main)/utilities/cookies/setCookie';
import DeleteCookie from '../../../(main)/utilities/cookies/deleteCookie';
import GetCookie from '../../../(main)/utilities/cookies/getCookie';

const LoginPage = () => {
    const toast = useRef<Toast>(null);
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = useForm<Login.loginRequest>();
    const router = useRouter();

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onSubmit = (data: any) => {
        if (checked) {
            SetCookie(
                'remember',
                {
                    checked: checked,
                    ...data
                },
                2
            );
        } else {
            DeleteCookie('remember');
        }
        AuthAccount.login(data).then((d: any) => {
            if (d.status === 200) {
                SetCookie(
                    'user',
                    {
                        ...d.data
                    },
                    1
                );
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Login success', life: 3000 });
                router.push('/');
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.message, life: 3000 });
            }
        });
    };
    useEffect(() => {
        if (GetCookie('remember')) {
            setChecked(true);
            setValue('email', GetCookie('remember').email);
            setValue('password', GetCookie('remember').password);
        }
    }, []);
    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Admin!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '400px' }}>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: 'Please enter a valid email !'
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <span className="p-float-label">
                                            <InputText id={field.name} value={field.value} className="w-full" onChange={(e) => field.onChange(e.target.value)} />
                                        </span>
                                        {errors.email?.type === 'required' && <p className="text-red-500">{errors.email.message}</p>}
                                        {errors.email?.type === 'pattern' && <p className="text-red-500">{errors.email.message}</p>}
                                    </>
                                )}
                            />
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2 mt-2">
                                Password
                            </label>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password is required.' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <span className="p-float-label">
                                            <Password id={field.name} {...field} inputRef={field.ref} feedback={false} />
                                        </span>
                                        {errors.password?.type === 'required' && <p className="text-red-500">{errors.password.message}</p>}
                                    </>
                                )}
                            />
                            <div className="flex align-items-center justify-content-between mb-5 mt-2 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                            </div>
                            <Button label="Sign In" type="submit" className="w-full p-3 text-xl"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
