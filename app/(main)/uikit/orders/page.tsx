/* eslint-disable @next/next/no-img-element */
'use client';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { Orders } from '../../../../types/demo';
import { Column } from 'primereact/column';
import { OrdersAPI } from '../../../store/services/OrdersServices/OrdersAPI';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import formatCurrency from '../../utilities/formatCurrency/page';

type StatusBill = {
    name: string;
    id: number;
};
function Orders() {
    const statusTemplate: StatusBill[] = [
        {
            name: 'Đơn hàng đã đặt',
            id: 1
        },
        {
            name: 'Tiếp nhận và xử lý',
            id: 2
        },
        {
            name: 'Đang giao hàng',
            id: 3
        },
        {
            name: 'Đã giao hàng',
            id: 4
        }
    ];

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [status, setStatus] = useState<StatusBill | null>(null);
    const [products, setProducts] = useState<Orders.OrderProducts[]>([]);
    const [order, setOrder] = useState<Orders.OrderResponse | null>(null);
    const [orders, setOrders] = useState<Orders.OrderResponse[]>([]);
    useEffect(() => {
        OrdersAPI.getOrders().then((data: any) => {
            setOrders(data);
        });
    }, []);

    const totalPriceBodyTemplate = (order: Orders.OrderResponse) => {
        return <p className="font-bold">{formatCurrency(order.totalPrice)}</p>;
    };
    const payBodyTemplate = (order: Orders.OrderResponse) => {
        return <Tag className="py-1 px-4" value={order.isPay ? 'Done' : 'Yet'} severity={order.isPay ? 'success' : 'danger'}></Tag>;
    };
    const cancelOrderBodyTemplate = (order: Orders.OrderResponse) => {
        return <Tag className="py-1 px-4" value={order.isCancelOrder ? 'Yes' : 'No'} severity={!order.isCancelOrder ? 'success' : 'danger'}></Tag>;
    };

    const statusBodyTemplate = (order: Orders.OrderResponse) => {
        return (
            <Dropdown
                disabled={order.isCancelOrder}
                value={status || statusTemplate[order.statusBill - 1]}
                onChange={(e: DropdownChangeEvent) => {
                    OrdersAPI.setStatus({
                        statusBill: e.value.id,
                        idBill: order.id
                    }).then((d) => {
                        if (d.status === 200) {
                            toast.current?.show({ severity: 'success', summary: 'Succwss', detail: 'Change status bill success', life: 3000 });
                            OrdersAPI.getOrders().then((data: any) => {
                                setOrders(data);
                            });
                        } else {
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.data.message, life: 3000 });
                        }
                    });
                }}
                options={statusTemplate}
                optionLabel="name"
                className="w-full md:w-14rem text-blue-600"
                placeholder="Select a City"
            />
        );
    };

    const productBodyTemplate = (order: Orders.OrderResponse) => {
        return (
            <div className="flex align-items-center justify-content-center flex-column">
                <p className="font-semibold">{order.products.length} product(s)</p>
            </div>
        );
    };
    const actionBodyTemplate = (order: Orders.OrderResponse) => {
        return (
            <div className="flex justify-content-center align-items-center	gap-3">
                <div
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                        setOrder(order);
                        setProducts(order.products);
                    }}
                >
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-external-link" data-pr-tooltip="Detail Order" data-pr-position="top" style={{ fontSize: '1.2rem' }} />
                </div>
            </div>
        );
    };
    const priceBodyTemplate = (product: Orders.OrderProducts) => {
        return formatCurrency(product.price * (1 - product.saleRate));
    };
    const imageBodyTemplate = (product: Orders.OrderProducts) => {
        return <img src={`${product.image}`} alt={product.name} className="w-7rem shadow-2 border-round" />;
    };
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}

                    <DataTable paginator rows={10} stripedRows ref={dt} scrollable value={orders} dataKey="id" className="datatable-responsive" emptyMessage="No products found." responsiveLayout="scroll">
                        <Column className="font-bold" field="name" header="Customer" style={{ minWidth: '200px' }} frozen sortable align={'center'}></Column>
                        <Column field="id" header="ID" sortable align={'center'}></Column>
                        <Column field="createdDate" header="CreatedDate" sortable align={'center'}></Column>
                        <Column field="sex" header="Sex" sortable align={'center'}></Column>
                        <Column field="address" header="Address" sortable align={'center'} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="isPay" header="Pay" sortable body={payBodyTemplate} align={'center'}></Column>
                        <Column field="phoneNumber" header="Phone Number" sortable align={'center'} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="totalPrice" header="Total Price" body={totalPriceBodyTemplate} sortable align={'center'} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="products" header="Products" sortable body={productBodyTemplate} align={'center'}></Column>
                        <Column field="statusBill" header="Status Orders" body={statusBodyTemplate} sortable align={'center'} headerStyle={{ minWidth: '11rem' }}></Column>
                        <Column header="Cancel Order" sortable body={cancelOrderBodyTemplate} align={'center'} headerStyle={{ minWidth: '11rem' }}></Column>
                        <Column header="Actions" sortable align={'center'} body={actionBodyTemplate} headerStyle={{ minWidth: '11rem' }}></Column>
                    </DataTable>
                    <Dialog header="Detail Order" visible={order !== null} style={{ width: '50vw' }} onHide={() => setOrder(null)}>
                        <p className="m-0">
                            <div>
                                <span className="font-semibold mr-2">Customer:</span>
                                <span>{order?.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">CreatedDate:</span>
                                <span>{order?.createdDate}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Sex:</span>
                                <span>{order?.sex}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Phone Number:</span>
                                <span>{order?.phoneNumber}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Email:</span>
                                <span>{order?.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Address:</span>
                                <span>{order?.address}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Pay:</span>
                                <span>{order?.isPay ? 'Paid' : 'Unpaid'}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">Payment Type:</span>
                                <span>{order?.paymentType}</span>
                            </div>
                            <div>
                                <span className="font-semibold mr-2">StatusBill:</span>
                                <span>{statusTemplate[order?.statusBill! - 1]?.name}</span>
                            </div>
                            <div className="mt-2">
                                <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="id" header="id"></Column>
                                    <Column field="name" header="Name"></Column>
                                    <Column header="Image" body={imageBodyTemplate}></Column>
                                    <Column header="Price" body={priceBodyTemplate}></Column>
                                    <Column field="amount" header="Quantity" align={'center'}></Column>
                                </DataTable>
                            </div>
                            {order?.note! && (
                                <div className="mt-2">
                                    <span className="font-semibold mr-2">Note:</span>
                                    <span>{order.note}</span>
                                </div>
                            )}
                            <div className="mt-2">
                                <span className="font-semibold mr-2">Temporary Price:</span>
                                <span>{formatCurrency(order?.temporaryPrice!)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="font-semibold mr-2">Price Delivery:</span>
                                <span>{formatCurrency(order?.priceDelivery!)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="font-semibold mr-2">Discount Price:</span>
                                <span>{formatCurrency(order?.discountPrice!)}</span>
                            </div>
                            <div className="mt-2 text-lg">
                                <span className="font-semibold mr-2 ">Total Price:</span>
                                <span className="font-semibold">{formatCurrency(order?.totalPrice!)}</span>
                            </div>
                        </p>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Orders;
