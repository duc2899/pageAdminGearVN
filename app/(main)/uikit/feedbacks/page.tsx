'use client';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { Feedback } from '../../../../types/demo';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Rating } from 'primereact/rating';
import { FeedbackAPI } from '../../../store/services/FeedbackServices/FeedbackAPI';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
const Feedbacks = () => {
    const toast = useRef<Toast>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback.feedbackResponse[]>([]);
    useEffect(() => {
        FeedbackAPI.getAllFeedback().then((d) => setFeedbacks(d.data));
    }, []);
    const imageBodyTemplate = (product: Feedback.feedbackResponse) => {
        return <img src={`${product.image}`} alt={product.product} className="w-7rem shadow-2 border-round" />;
    };
    const ratingBodyTemplate = (product: Feedback.feedbackResponse) => {
        return <Rating value={product.star} readOnly cancel={false} />;
    };

    const confirmDeleteUser = (id: number, idProduct: number) => {
        confirmDialog({
            message: `Are you sure you want to delete feedback with id = ${id}?`,
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept() {
                FeedbackAPI.deleteFeedback({
                    idFeedback: id,
                    idProduct: idProduct
                })
                    .then((data) => {
                        if (data.status === 200) {
                            FeedbackAPI.getAllFeedback().then((data) => {
                                setFeedbacks(data);
                            });
                            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete feedback success', life: 3000 });
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                        }
                    })
                    .catch((error) => console.log(error));
            }
        });
    };
    const actionsTemplate = (data: Feedback.feedbackResponse) => {
        return (
            <div className="flex justify-content-center align-items-center	gap-3">
                <div className="cursor-pointer text-red-500" onClick={() => confirmDeleteUser(data.id!, data.idProduct)}>
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-trash" data-pr-tooltip="Delete" data-pr-position="top" style={{ fontSize: '1.5rem' }} />
                </div>
            </div>
        );
    };
    return (
        <div className="grid">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="col-12">
                <div className="card">
                    <h5>Feedbacks</h5>
                    <DataTable
                        value={feedbacks}
                        paginator
                        scrollable
                        scrollHeight="500px"
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        filterDisplay="menu"
                        globalFilterFields={['name', 'phoneNumber', 'email', 'id']}
                        responsiveLayout="scroll"
                        emptyMessage={<div className="text-xl flex justify-content-center align-items-center font-medium h-9rem">No feedback found</div>}
                    >
                        <Column field="id" sortable header="ID" filterMenuStyle={{ width: '14rem' }} />
                        <Column field="user" header="Email" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} frozen />
                        <Column header="Product" field="product" sortable filterField="representative" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} />
                        <Column header="Created Date" sortable field="createdDate" style={{ minWidth: '10rem' }} />
                        <Column header="Image" body={imageBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                        <Column field="message" header="Message" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                        <Column header="Rating" sortable filterMenuStyle={{ width: '14rem' }} body={ratingBodyTemplate} style={{ minWidth: '12rem' }} />
                        <Column header="Actions" style={{ minWidth: '12rem' }} body={actionsTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
export default Feedbacks;
