/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { ProductAPi } from '../../../store/services/ProductServices/ProductAPI';
import { Demo } from '../../../../types/types';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Paginator } from 'primereact/paginator';
import { RadioButton } from 'primereact/radiobutton';
import { CategoryAPI } from '../../../store/services/CategoryServices/CategoryAPI';
import { Category, Producer } from '../../../../types/demo';
import { ProducerAPI } from '../../../store/services/ProducerServices/ProducerAPI';
import ActionsProduct from './ActionsProduct';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface Category {
    name: string;
    code: number;
}

interface Option {
    name: string;
    value: boolean;
}

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    const laptopProperties = [
        {
            id: 1,
            name: 'cpu',
            isText: false
        },
        {
            id: 2,
            name: 'ram',
            isText: false
        },
        {
            id: 3,
            name: 'ssd',
            isText: false
        },
        {
            id: 4,
            name: 'vga',
            isText: false
        },
        {
            id: 5,
            name: 'size',
            isText: false
        },
        {
            id: 6,
            name: 'screen',
            isText: false
        },
        {
            id: 7,
            name: 'color',
            isText: false
        },
        {
            id: 8,
            name: 'operatingSystem',
            isText: false
        }
    ];
    const mouseProperties = [
        {
            id: 1,
            name: 'dpi',
            isText: false
        },
        {
            id: 2,
            name: 'size',
            isText: false
        },
        {
            id: 3,
            name: 'connection',
            isText: true
        },
        {
            id: 4,
            name: 'charger',
            isText: true
        },
        {
            id: 5,
            name: 'rgb',
            isText: true
        },
        {
            id: 6,
            name: 'color',
            isText: false
        }
    ];
    const PROPERTIES = [laptopProperties, mouseProperties];
    const types: Category[] = [
        { name: 'Laptop', code: 1 },
        { name: 'Mouse', code: 2 },
        { name: 'Keyboard', code: 3 }
    ];
    const options: Option[] = [
        {
            name: 'Có',
            value: true
        },
        {
            name: 'Không',
            value: false
        }
    ];

    const [products, setProducts] = useState<Demo.ListProduct>();
    const [categories, setCategories] = useState<Category.Category[]>([]);
    const [producers, setProducers] = useState<Producer.Producer[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [newProductDialog, setNewProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product | undefined>();
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [size, setSize] = useState<number>(2);
    const [rows, setRows] = useState<number>(2);
    const [fist, setFirst] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<Category | null>(types[0]);
    const [selectCategory, setSelectCategory] = useState<Category | null>(types[0]);
    const [selectProducer, setSelectProducer] = useState<number | undefined>();

    const [selectedOptions, setSelectedOptions] = useState<Option | null>(options[0]);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        setValue,
        formState: { errors }
    } = useForm<Demo.ProductRequest>();

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductAPi.getProduct({
            page: currentPage,
            size: size,
            type: selectedType?.code
        }).then((data) => {
            setProducts(data);
        });
    }, [selectedType, currentPage, size]);
    useEffect(() => {
        CategoryAPI.getCategory().then((data) => setCategories(data));
        ProducerAPI.getProducer().then((data) => setProducers(data));
    }, []);
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const openNew = () => {
        setNewProductDialog(true);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Dropdown value={selectedType} onChange={(e: any) => setSelectedType(e.value)} options={types} optionLabel="name" placeholder="Select a type" className="w-full md:w-14rem mr-3" />
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    const priceBodyTemplate = (product: any) => {
        return <p>{formatCurrency(product.oldPrice)}</p>;
    };
    //  StartBodyTemplate
    function CalculateStars(data: Demo.Product) {
        const totalStars = data?.dataFeedback.reduce((total, current) => {
            return total + current.star;
        }, 0);
        const res: number | undefined = totalStars / data?.dataFeedback.length;
        return res ? Math.floor(res) : 0;
    }
    const ratingBodyTemplate = (product: Demo.Product) => {
        return <Rating value={CalculateStars(product)} color="#1E9800" readOnly cancel={false} />;
    };
    // StatusBodyTemplate
    const statusBodyTemplate = (product: Demo.Product) => {
        return <Tag value={product.quantity! <= 0 ? 'LOWSTOCK' : 'INSTOCK'} severity={product.quantity! <= 0 ? 'danger' : 'success'}></Tag>;
    };
    // ImageBodyTemplate
    const imageBodyTemplate = (product: Demo.Product) => {
        return <img src={`${product.image}`} alt={product.title} className="w-7rem shadow-2 border-round" />;
    };
    // ActionsBodyTemplate
    const actionBodyTemplate = (product: Demo.Product) => {
        return (
            <div className="flex justify-content-center align-items-center	gap-3">
                <div style={{ marginTop: `0.5px` }} className="cursor-pointer text-yellow-500">
                    <Tooltip target=".edit-user" />
                    <i className="edit-user pi pi-file-edit" data-pr-tooltip="Edit product" data-pr-position="top" style={{ fontSize: '1.2rem' }} />
                </div>
                <div className="cursor-pointer text-red-500">
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-trash" data-pr-tooltip="Delete product" data-pr-position="top" style={{ fontSize: '1.2rem' }} />
                </div>
                <div
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                        setProduct(product), setProductDialog(true);
                    }}
                >
                    <Tooltip target=".delete-user" />
                    <i className="delete-user pi pi-external-link" data-pr-tooltip="Detail product" data-pr-position="top" style={{ fontSize: '1.2rem' }} />
                </div>
            </div>
        );
    };

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(event.page);
        setSize(event.pageCount);
    };
    // FooterDialogBodyTemplate
    const footerBodyTemplate = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setNewProductDialog(false)} />
                <Button label="Add" type="submit" icon="pi pi-check" autoFocus onClick={handleSubmit(onSubmit)} />
            </div>
        );
    };
    const onSubmit: SubmitHandler<Demo.ProductRequest> = (data) => {
        console.log(data);
    };
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products?.data}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="title" header="Name" sortable headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column header="Price" sortable body={priceBodyTemplate} align={'center'}></Column>
                        <Column header="Image" body={imageBodyTemplate} headerStyle={{ minWidth: '13rem' }} align={'center'}></Column>
                        <Column field="saleRate" header="SaleRate" sortable align={'center'}></Column>
                        <Column field="quantity" header="Quantity" sortable align={'center'}></Column>
                        <Column header="Status" sortable body={statusBodyTemplate} align={'center'}></Column>
                        <Column field="producer" header="Producer" sortable align={'center'}></Column>
                        <Column field="type" header="Category" sortable align={'center'}></Column>
                        <Column header="Rating" sortable body={ratingBodyTemplate} align={'center'}></Column>
                        <Column header="Actions" sortable body={actionBodyTemplate} align={'center'}></Column>
                    </DataTable>
                    <Paginator first={fist} rows={rows} totalRecords={products?.totalElements} onPageChange={onPageChange} />

                    <Dialog visible={newProductDialog} header="Add New A Product" modal className="p-fluid w-6" onHide={() => setNewProductDialog(false)} footer={footerBodyTemplate}>
                        <form>
                            <div className="field">
                                <label htmlFor="name" className="font-medium">
                                    Title
                                </label>
                                <InputText id="name" {...register('title', { required: 'Title is required' })} />
                                {errors.title?.type === 'required' && <p className="text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="field">
                                <label htmlFor="description" className="font-medium">
                                    Description
                                </label>
                                <InputTextarea id="description" {...register('description', { required: 'Description is required' })} rows={3} cols={20} />
                                {errors.description?.type === 'required' && <p className="text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="field">
                                <label className="mb-3 font-medium">Category</label>
                                <div className="formgrid grid">
                                    {categories?.map((category) => (
                                        <div className="field-radiobutton col-6" key={category.id}>
                                            <RadioButton inputId={category.name} value={category.id} name="category" onChange={(e) => setSelectCategory({ code: e.value, name: category.name })} checked={selectCategory?.code == category.id} />
                                            <label htmlFor={category.name} className="cursor-pointer">
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="field">
                                <label className="mb-3 font-medium">Producer</label>
                                <Controller
                                    control={control}
                                    name="idProducer"
                                    rules={{ required: 'Producer is required' }}
                                    render={({ field }) => (
                                        <div className="formgrid grid">
                                            {producers.map((producer) => (
                                                <div className="field-radiobutton col-6" key={producer.id}>
                                                    <RadioButton inputId={producer.name} {...field} value={producer.id} inputRef={field.ref} name="category" checked={producer.id == field.value} />
                                                    <label htmlFor={producer.name} className="cursor-pointer">
                                                        {producer.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                ></Controller>

                                {errors.idProducer?.type === 'required' && <p className="text-red-500">{errors.idProducer.message}</p>}
                            </div>

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="price" className="font-medium">
                                        Price
                                    </label>
                                    <InputNumber id="price" mode="currency" currency="VND" locale="en-US" />
                                </div>
                                <div className="field col">
                                    <label htmlFor="quantity" className="font-medium">
                                        Quantity
                                    </label>
                                    <InputNumber id="quantity" />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                {PROPERTIES[selectCategory?.code! - 1].map((property) => (
                                    <div className="col-6 mt-2" key={property.id}>
                                        {!property.isText ? (
                                            <div>
                                                <label htmlFor={property.name} className="font-medium text-transform: capitalize">
                                                    {property.name}
                                                </label>
                                                <InputText className=" mr-3 mt-2" />
                                            </div>
                                        ) : (
                                            <div>
                                                <label htmlFor={property.name} className="font-medium text-transform: capitalize">
                                                    {property.name}
                                                </label>
                                                <Dropdown value={selectedOptions} onChange={(e: any) => setSelectedOptions(e.value)} options={options} optionLabel={'name'} placeholder="Select a type" className="w-full mr-3 mt-2" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </form>
                    </Dialog>
                    <ActionsProduct product={product} productDialog={productDialog} setProductDialog={setProductDialog}></ActionsProduct>

                    {/* <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog> */}

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
