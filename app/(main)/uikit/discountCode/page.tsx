'use client';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { DiscountCode } from '../../../../types/demo';
import { Column } from 'primereact/column';
import { DiscountCodeAPI } from '../../../store/services/DiscountServices/DiscountCodeAPI';
import formatCurrency from '../../utilities/formatCurrency/page';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';

function DiscountCode() {
    const toast = useRef<Toast>(null);

    const [discountCode, setDiscountCode] = useState<DiscountCode.discountCodeResponse[]>([]);
    const [modalAddNewDC, setModalAddNewDC] = useState<boolean>(false);
    const [editCode, setEditCode] = useState<DiscountCode.discountCodeResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        condition_price: 0,
        reduce_price: 0,
        expiry: '',
        code: ''
    };
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues
    });
    useEffect(() => {
        if (editCode) {
            setValue('code', editCode.code);
            setValue('condition_price', editCode.condition_price);
            setValue('reduce_price', editCode.reduce_price);
            setValue('expiry', editCode.expiry);
        } else {
            reset();
        }
    }, [editCode, setValue, reset]);
    useEffect(() => {
        DiscountCodeAPI.getDiscountCode().then((data) => setDiscountCode(data));
    }, []);
    const conditionPriceBodyTemplate = (discountCode: DiscountCode.discountCodeResponse) => {
        return <p>{formatCurrency(discountCode.condition_price)}</p>;
    };
    const reducePriceBodyTemplate = (discountCode: DiscountCode.discountCodeResponse) => {
        return <p>{formatCurrency(discountCode.reduce_price)}</p>;
    };
    const checkExpiredBodyTemplate = (discountCode: DiscountCode.discountCodeResponse) => {
        function checkTimeResult() {
            var expiredTime = new Date(discountCode.expiry);
            return new Date() > expiredTime;
        }
        return <Tag severity={checkTimeResult() ? 'danger' : 'success'} value={checkTimeResult() ? 'expired' : 'unExpired'}></Tag>;
    };
    const header = () => {
        return (
            <div className="my-2">
                <Button label="Create" icon="pi pi-plus" severity="success" className=" mr-2" onClick={() => setModalAddNewDC(true)} />
            </div>
        );
    };
    const actionsBodyTemplate = (discountCode: DiscountCode.discountCodeResponse) => {
        const handelDeleteDiscountCode = () => {
            confirmDialog({
                message: `Are you sure you want to delete discount code with id = ${discountCode.id}?`,
                header: 'Delete Discount Code',
                icon: 'pi pi-exclamation-triangle',
                accept() {
                    DiscountCodeAPI.deleteDiscountCode(discountCode.id)
                        .then((data) => {
                            if (data.status === 200) {
                                DiscountCodeAPI.getDiscountCode().then((data) => setDiscountCode(data));
                                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete a discount code success', life: 3000 });
                            } else {
                                toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                            }
                        })
                        .catch((error) => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something wrong in server', life: 3000 }));
                }
            });
        };

        return (
            <div className="flex justify-content-center align-items-center	gap-3">
                <div
                    style={{ marginTop: `0.5px` }}
                    className="cursor-pointer text-yellow-500"
                    onClick={() => {
                        setEditCode(discountCode), setModalAddNewDC(true);
                    }}
                >
                    <Tooltip target=".edit-user" />
                    <i className="edit-user pi pi-file-edit" data-pr-tooltip="Edit code" data-pr-position="top" style={{ fontSize: '1.5rem' }} />
                </div>
                <div className="cursor-pointer text-red-500" onClick={handelDeleteDiscountCode}>
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-trash" data-pr-tooltip="Delete code" data-pr-position="top" style={{ fontSize: '1.5rem' }} />
                </div>
            </div>
        );
    };
    const onSubmit = (data: any) => {
        setLoading(true);
        function convert(x: number) {
            return x < 10 ? '0' + x : x.toString();
        }
        const date = new Date(data.expiry).getFullYear() + '-' + convert(new Date(data.expiry).getMonth() + 1) + '-' + convert(new Date(data.expiry).getDate()) + 'T';
        const time = convert(new Date(data.expiry).getHours()) + ':' + convert(new Date(data.expiry).getMinutes()) + ':' + convert(new Date(data.expiry).getSeconds());
        data.expiry = date + time;
        if (editCode) {
            data.id = editCode.id;
            DiscountCodeAPI.editDiscountCode(data).then((d) => {
                if (d.status === 200) {
                    setLoading(false);
                    reset();
                    setModalAddNewDC(false);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Update discount code success', life: 3000 });
                    DiscountCodeAPI.getDiscountCode().then((data) => setDiscountCode(data));
                } else {
                    setLoading(false);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.message, life: 3000 });
                }
            });
        } else {
            DiscountCodeAPI.crateDiscountCode(data).then((d) => {
                if (d.status === 201) {
                    setLoading(false);
                    reset();
                    setModalAddNewDC(false);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Crate a discount code success', life: 3000 });
                    DiscountCodeAPI.getDiscountCode().then((data) => setDiscountCode(data));
                } else {
                    setLoading(false);
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.message, life: 3000 });
                }
            });
        }
    };
    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="col-12">
                <div className="card">
                    <h5>Discount Code</h5>
                    <DataTable
                        value={discountCode}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        filterDisplay="menu"
                        // loading={loading1}
                        // globalFilterFields={['name', 'phoneNumber', 'email', 'id']}
                        responsiveLayout="scroll"
                        emptyMessage={<div className="text-xl flex justify-content-center align-items-center font-medium h-9rem">No Discount Code Found</div>}
                        header={header}
                    >
                        <Column field="id" sortable header="ID" filterMenuStyle={{ width: '14rem' }} />
                        <Column header="Condition Price" field="condition_price" sortable filterField="representative" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={conditionPriceBodyTemplate} align={'center'} />
                        <Column header="Reduce Price" sortable field="reduce_price" style={{ minWidth: '10rem' }} body={reducePriceBodyTemplate} align={'center'} />
                        <Column header="Expiry" field="expiry" sortable style={{ minWidth: '12rem' }} align={'center'} />
                        <Column field="code" header="Code" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} align={'center'} />
                        <Column header="Expired" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={checkExpiredBodyTemplate} align={'center'} />
                        <Column header="Actions" style={{ minWidth: '12rem' }} body={actionsBodyTemplate} align={'center'} />
                    </DataTable>
                </div>
            </div>
            <Dialog
                header={editCode === null ? 'Create a new discount code' : 'Edit discount code'}
                visible={modalAddNewDC}
                className="w-6"
                onHide={() => {
                    setModalAddNewDC(false), setEditCode(null);
                }}
            >
                <div className="flex w-full">
                    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-column gap-2 mb-2">
                            <label htmlFor="code">Code</label>
                            <InputText className={`${errors.code?.type === 'required' && 'p-invalid'}`} id="code" {...register('code', { required: 'Code is required' })} />
                            {errors.code?.type === 'required' && <p className="text-red-500">{errors.code.message}</p>}
                        </div>
                        <Controller
                            name="condition_price"
                            control={control}
                            rules={{ required: 'Condition price is required.' }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-column gap-2 mb-2">
                                    <label htmlFor={field.name}>Condition Price</label>
                                    <InputNumber
                                        id={field.name}
                                        ref={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        mode="currency"
                                        currency="VND"
                                        locale="VN"
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors.condition_price?.type === 'required' && <p className="text-red-500">{errors.condition_price.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            name="reduce_price"
                            control={control}
                            rules={{ required: 'Reduce price is required.' }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-column gap-2 mb-2">
                                    <label htmlFor={field.name}>Reduce Price</label>
                                    <InputNumber
                                        id={field.name}
                                        ref={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        mode="currency"
                                        currency="VND"
                                        locale="VN"
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors.reduce_price?.type === 'required' && <p className="text-red-500">{errors.reduce_price.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            name="expiry"
                            control={control}
                            rules={{ required: 'Expiry is required.' }}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-column gap-2 mb-2">
                                    <label htmlFor={field.name}>Expiry</label>
                                    <Calendar inputId={field.name} value={field.value} onChange={field.onChange} dateFormat="yy-mm-dd" showTime inputClassName={classNames({ 'p-invalid': fieldState.error })} />
                                    {errors.expiry?.type === 'required' && <p className="text-red-500">{errors.expiry.message}</p>}
                                </div>
                            )}
                        />
                        <div className="flex flex-column gap-2 mt-3">
                            <Button loading={loading} label="Submit" className="flex align-items-center justify-content-center" />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    );
}

export default DiscountCode;
