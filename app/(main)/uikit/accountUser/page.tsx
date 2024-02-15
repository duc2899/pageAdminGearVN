'use client';
import { AccountAPi } from '../../../store/services/AccountServices/AccountAPI';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import type { Demo } from '../../../../types/types';
import { Dialog } from 'primereact/dialog';
import { useForm, SubmitHandler, Form } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useDebounce } from 'primereact/hooks';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';

import _ from 'lodash';

const TableDemo = () => {
    interface IFormUser {
        name: string;
        password: string;
        confirmPassword: string;
        email: string;
        phoneNumber: string;
        isActive: boolean;
    }

    const toast = useRef<Toast>(null);
    const [customers, setCustomers] = useState<Demo.Customer[]>([]);
    const [modalAddUser, setModalAddUser] = useState(false);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phoneNumber: { value: null, matchMode: FilterMatchMode.EQUALS },
        createdAt: { value: null, matchMode: FilterMatchMode.EQUALS },
        role: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading1, setLoading1] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [email, debouncedValue, setEmail] = useDebounce('', 1000);
    const [isExitEmail, setIsExitEmail] = useState(false);
    const [isEditUser, setIsEditUser] = useState<boolean>(false);
    const [dataUserOld, setDataUserOld] = useState<any>({});
    const [togglePassword, setTogglePassword] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<boolean>(false);
    const status = [
        { name: 'Active', value: true },
        { name: 'Inactive', value: false }
    ];
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors }
    } = useForm<IFormUser>();

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
                <Tooltip target=".add-user" />
                <i
                    onClick={() => {
                        setModalAddUser(true), setIsEditUser(false);
                    }}
                    className="add-user pi pi-user-plus hover:text-purple-600"
                    data-pr-tooltip="Add user"
                    data-pr-position="top"
                    style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                ></i>
            </div>
        );
    };

    useEffect(() => {
        AccountAPi.getListUsers().then((data) => {
            setCustomers(data.filter((d) => d.role === 'USER'));
            setLoading1(false);
        });
    }, []);

    const header = renderHeader();

    const onSubmit: SubmitHandler<IFormUser> = (data) => {
        if (!isExitEmail) {
            if (!isEditUser) {
                let newData: InterfaceAccountUser.AddUser = { email: data.email, name: data.name, password: data.password, phoneNumber: data.phoneNumber };
                AccountAPi.addUser(newData)
                    .then((data) => {
                        if (data) {
                            reset();
                            setModalAddUser(false);
                            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Create a user success', life: 3000 });
                            AccountAPi.getListUsers().then((data) => {
                                setCustomers(data.filter((d) => d.role === 'USER'));
                            });
                            return;
                        }
                    })
                    .catch((error) => error && toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something wrong in server', life: 3000 }));
                return;
            } else {
                data.isActive = selectedStatus;
                const { role, id, createdAt, ...rest } = dataUserOld;
                const { confirmPassword, ...newData } = data;
                if (_.isEqual(rest, newData)) {
                    reset();
                    setModalAddUser(false);
                    toast.current?.show({ severity: 'info', summary: 'Information', detail: 'Nothing changes', life: 3000 });
                    return;
                } else {
                    const dataUserEdit: InterfaceAccountUser.EditUser = {
                        id: id,
                        userName: newData.name,
                        email: newData.email,
                        password: newData.password,
                        phoneNumber: newData.phoneNumber,
                        isActive: newData.isActive
                    };
                    AccountAPi.editUser(dataUserEdit)
                        .then((data) => {
                            if (data.status === 200) {
                                reset();
                                setModalAddUser(false);
                                AccountAPi.getListUsers().then((data) => {
                                    setCustomers(data.filter((d) => d.role === 'USER'));
                                });
                                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Edit a user success', life: 3000 });
                            }
                        })
                        .catch((err) => {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Fault to edit user', life: 3000 });
                            console.log(err);
                        });
                }
            }
        }
    };

    useEffect(() => {
        if (debouncedValue) {
            AccountAPi.checkEmail(debouncedValue)
                .then((data) => {
                    if (data.status === 200) {
                        setIsExitEmail(false);
                    }
                })
                .catch((error) => error && setIsExitEmail(true));
        }
        setIsExitEmail(false);
    }, [debouncedValue]);

    const confirmDeleteUser = (id: number) => {
        confirmDialog({
            message: `Are you sure you want to delete user with id = ${id}?`,
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept() {
                AccountAPi.deleteUser(id)
                    .then((data) => {
                        if (data.status === 200) {
                            AccountAPi.getListUsers().then((data) => {
                                setCustomers(data.filter((d) => d.role === 'USER'));
                            });
                            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete a user success', life: 3000 });
                        }
                    })
                    .catch((error) => console.log(error));
            }
        });
    };
    const handelEditUser = (data: Demo.Customer) => {
        setDataUserOld(data);
        setSelectedStatus(data.isActive);
        setValue('name', data.name!, { shouldValidate: true });
        setValue('email', data.email, { shouldValidate: true });
        setValue('password', data.password, { shouldValidate: true });
        setValue('confirmPassword', data.password, { shouldValidate: true });
        setValue('phoneNumber', data.phoneNumber, { shouldValidate: true });
        setModalAddUser(true);
        setIsEditUser(true);
    };
    const actionsTemplate = (data: Demo.Customer) => {
        return (
            <div className="flex justify-content-center align-items-center	gap-3">
                <div style={{ marginTop: `0.5px` }} className="cursor-pointer text-yellow-500" onClick={() => handelEditUser(data)}>
                    <Tooltip target=".edit-user" />
                    <i className="edit-user pi pi-user-edit" data-pr-tooltip="Edit user" data-pr-position="top" style={{ fontSize: '1.5rem' }} />
                </div>
                <div className="cursor-pointer text-red-500" onClick={() => confirmDeleteUser(data.id!)}>
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-user-minus" data-pr-tooltip="Delete user" data-pr-position="top" style={{ fontSize: '1.5rem' }} />
                </div>
            </div>
        );
    };
    const statusTemplate = (data: Demo.Customer) => {
        return (
            <div>{data.isActive ? <div className="p-1 bg-green-400 border-round-sm font-medium text-white w-6 text-center">Active</div> : <div className="p-1 bg-gray-400 border-round-sm font-medium text-white w-6 text-center">InActive</div>}</div>
        );
    };
    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="col-12">
                <div className="card">
                    <h5>Account Users</h5>
                    <DataTable
                        value={customers}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        filterDisplay="menu"
                        loading={loading1}
                        globalFilterFields={['name', 'phoneNumber', 'email', 'id']}
                        responsiveLayout="scroll"
                        emptyMessage={<div className="text-xl flex justify-content-center align-items-center font-medium h-9rem">No customers found</div>}
                        header={header}
                    >
                        <Column field="id" sortable header="ID" style={{ minWidth: '12rem' }} filterMenuStyle={{ width: '14rem' }} />
                        <Column header="Name" field="name" sortable filterField="representative" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} />
                        <Column header="Created Date" sortable field="createdAt" style={{ minWidth: '10rem' }} />
                        <Column header="Role" field="role" sortable style={{ minWidth: '10rem' }} />
                        <Column field="email" header="Email" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                        <Column field="phoneNumber" sortable header="Phone number" showFilterMatchModes={false} style={{ minWidth: '12rem' }} />
                        <Column field="isActive" sortable header="Status" showFilterMatchModes={false} body={statusTemplate} style={{ minWidth: '12rem' }} />
                        <Column header="Actions" style={{ minWidth: '12rem' }} body={actionsTemplate} />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header={`${isEditUser ? 'Edit user' : 'Add new user'}`}
                visible={modalAddUser}
                className="w-6"
                onHide={() => {
                    setModalAddUser(false), isEditUser && setIsEditUser(false), reset(), setIsExitEmail(false);
                }}
            >
                <div className="flex w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-6">
                        {isEditUser && (
                            <div className="flex flex-column gap-2 mb-2">
                                <label htmlFor="id">ID</label>
                                <InputText id="id" disabled value={dataUserOld.id} />
                            </div>
                        )}
                        <div className="flex flex-column gap-2 mb-2">
                            <label htmlFor="username">Username</label>
                            <InputText
                                className={`${(errors.name?.type === 'required' || errors.name?.type === 'maxLength' || errors.name?.type === 'minLength') && 'p-invalid'}`}
                                id="username"
                                {...register('name', { required: 'Username is required', maxLength: 15, minLength: 3 })}
                            />
                            {errors.name?.type === 'required' && <p className="text-red-500">{errors.name.message}</p>}
                            {(errors.name?.type === 'maxLength' || errors.name?.type === 'minLength') && <p className="text-red-500">User name must be 3 to 15 characters</p>}
                        </div>
                        <div className="flex flex-column gap-2  mb-2">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                className={`${(errors.email?.type === 'required' || errors.email?.type === 'pattern' || isExitEmail) && 'p-invalid'}`}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                    onChange: (e) => setEmail(e.target.value)
                                })}
                            />
                            {errors.email?.type === 'required' && <p className="text-red-500">{errors.email.message}</p>}
                            {errors.email?.type === 'pattern' && <p className="text-red-500">Email is invalid</p>}
                            {isExitEmail && <p className="text-red-500">Email is exits</p>}
                        </div>
                        <div className="flex flex-column gap-2 mb-2">
                            <label htmlFor="phoneNumber">Phone number</label>
                            <InputText
                                className={`${(errors.phoneNumber?.type === 'required' || errors.phoneNumber?.type === 'pattern') && 'p-invalid'}`}
                                id="phoneNumber"
                                {...register('phoneNumber', { required: 'Phone number is required', pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g })}
                            />
                            {errors.phoneNumber?.type === 'required' && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                            {errors.phoneNumber?.type === 'pattern' && <p className="text-red-500">Phone number is invalid</p>}
                        </div>
                        <div className="flex flex-column gap-2 mb-2 ">
                            <label htmlFor="password">Password</label>

                            <div className="relative">
                                <InputText
                                    style={{ width: `100%` }}
                                    type={`${togglePassword ? 'password' : 'text'}`}
                                    className={`${(errors.password?.type === 'maxLength' || errors.password?.type === 'minLength' || errors.password?.type === 'required') && 'p-invalid'}`}
                                    id="password"
                                    {...register('password', { required: 'Password is required', maxLength: 15, minLength: 3 })}
                                />
                                <div style={{ position: `absolute`, top: `50%`, right: `10px`, transform: `translateY(-50%)`, cursor: `pointer` }} onClick={() => setTogglePassword(!togglePassword)}>
                                    <i className={`pi ${togglePassword ? 'pi-eye-slash' : 'pi-eye'}`} />
                                </div>
                            </div>
                            {errors.password?.type === 'required' && <p className="text-red-500">{errors.password.message}</p>}
                            {(errors.password?.type === 'maxLength' || errors.password?.type === 'minLength') && <p className="text-red-500">Password must be 3 to 15 characters</p>}
                        </div>
                        {isEditUser && (
                            <div className="flex flex-column gap-2  mb-2">
                                <label htmlFor="cPassword">Status</label>
                                <Dropdown value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} options={status} optionLabel="name" placeholder="Select status" className="w-full" />
                            </div>
                        )}
                        {!isEditUser && (
                            <div className="flex flex-column gap-2  mb-2">
                                <label htmlFor="cPassword">Confirm Password</label>
                                <InputText
                                    type="password"
                                    id="cPassword"
                                    {...register('confirmPassword', {
                                        validate: (val: string) => {
                                            if (watch('password') != val) {
                                                return 'Your passwords do not match';
                                            }
                                        }
                                    })}
                                />
                                {errors.confirmPassword?.type === 'validate' && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        )}
                        <div className="flex flex-column gap-2 mt-3">
                            <Button label="Submit" className="flex align-items-center justify-content-center" />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    );
};

export default TableDemo;
