/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
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
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Paginator } from 'primereact/paginator';
import { RadioButton } from 'primereact/radiobutton';
import { CategoryAPI } from '../../../store/services/CategoryServices/CategoryAPI';
import { Category, Producer } from '../../../../types/demo';
import { ProducerAPI } from '../../../store/services/ProducerServices/ProducerAPI';
import formatCurrency from '../../utilities/formatCurrency/page';
import ActionsProduct from './ActionsProduct';
import { Controller, useForm } from 'react-hook-form';

interface Option {
    id: number;
    name: string;
    value: string;
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
            id: 6,
            name: 'color',
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
        }
    ];
    const keyboardProperties = [
        {
            id: 1,
            name: 'expand',
            isText: false
        },
        {
            id: 2,
            name: 'material',
            isText: false
        },
        {
            id: 3,
            name: 'switches',
            isText: false
        },
        {
            id: 4,
            name: 'size',
            isText: false
        },
        {
            id: 5,
            name: 'color',
            isText: false
        },
        {
            id: 6,
            name: 'connection',
            isText: true
        },
        {
            id: 7,
            name: 'charger',
            isText: true
        },
        {
            id: 8,
            name: 'rgb',
            isText: true
        }
    ];
    const PROPERTIES = [laptopProperties, mouseProperties, keyboardProperties];
    const types: Category.Category[] = [
        { name: 'laptop', id: 1 },
        { name: 'mouse', id: 2 },
        { name: 'keyboard', id: 3 }
    ];
    const options: Option[] = [
        {
            id: 1,
            name: 'Có',
            value: 'true'
        },
        {
            id: 2,
            name: 'Không',
            value: 'false'
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
    const [size, setSize] = useState<number>(10);
    const [rows, setRows] = useState<number>(10);
    const [fist, setFirst] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<Category.Category | null>(types[0]);

    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const defaultValues = {
        title: '',
        oldPrice: 0,
        saleRate: 0,
        quantity: 0,
        idCategory: 0,
        idProducer: 0,
        description: '',
        properties: {}
    };
    const form = useForm({ defaultValues });

    const errors = form.formState.errors;
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        if (isEdit) {
            form.setValue('title', product?.title!);
            form.setValue('oldPrice', product?.oldPrice!);
            form.setValue('quantity', product?.quantity!);
            form.setValue('description', product?.description!);
            form.setValue('saleRate', product?.saleRate!);
            form.setValue('idCategory', types.findIndex((e) => e.name === product?.type) + 1);
            form.setValue('idProducer', producers.findIndex((e) => e.name === product?.producer) + 1);
            product?.properties?.map((pr) => form.setValue(`properties.${pr.name}`, pr.properties));
        } else {
            form.reset();
        }
    }, [isEdit, product]);
    useEffect(() => {
        form.reset();
    }, [selectedType]);
    useEffect(() => {
        ProductAPi.getProduct({
            page: currentPage,
            size: size,
            type: selectedType?.id
        }).then((data) => {
            setProducts(data);
        });
    }, [selectedType, currentPage, size]);
    useEffect(() => {
        CategoryAPI.getCategory().then((data) => setCategories(data));
        ProducerAPI.getProducer().then((data) => setProducers(data));
    }, []);

    const openNew = () => {
        setIsEdit(false);
        setNewProductDialog(true);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
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
                <div
                    style={{ marginTop: `0.5px` }}
                    className="cursor-pointer text-yellow-500"
                    onClick={() => {
                        setProduct(product), setNewProductDialog(true), setIsEdit(true);
                    }}
                >
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
                        setProduct(product), setProductDialog(true), setIsEdit(true);
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
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => !loading && setNewProductDialog(false)} />
                <Button label="Add" loading={loading} type="submit" icon="pi pi-check" autoFocus onClick={form.handleSubmit(onSubmit)} />
            </div>
        );
    };
    let image = new FormData();
    let imagePreview = new FormData();
    const invoiceUploadImageHandler = (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        image.append('file', file);
    };
    const invoiceUploadPreviewImageHandler = (event: FileUploadHandlerEvent) => {
        event.files.forEach((file) => {
            imagePreview.append('file', file);
        });
    };

    const uploadImage = async (id: number) => {
        let res = true;
        let message = 'Upload product success';
        await ProductAPi.sendImage(image, id).then((d) => {
            if (d.status !== 200) {
                setLoading(false);
                message = d.message;
                return (res = false);
            }
        });
        await ProductAPi.sendImagePreview(imagePreview, id).then((d) => {
            if (d.status !== 200) {
                setLoading(false);
                message = d.message;
                return (res = false);
            }
        });
        setLoading(false);

        if (res) {
            return toast.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        } else {
            return toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    const onSubmit = (data: any) => {
        if (Array.from(image.keys()).length <= 0 || Array.from(imagePreview.keys()).length <= 0) {
            return;
        }
        data.idCategory! = selectedType?.id;
        data.saleRate = data.saleRate / 100;
        if (data.properties.connection || data.properties.charger || data.properties.rgb) {
            data.properties.connection = JSON.parse(data.properties.connection);
            data.properties.charger = JSON.parse(data.properties.charger);
            data.properties.rgb = JSON.parse(data.properties.rgb);
        }
        ProductAPi.addProduct(data, types[data.idCategory - 1].name).then((data) => {
            setLoading(true);
            if (data.status === 201) {
                uploadImage(data.data.id);
            } else {
                setLoading(false);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
        });
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

                    <Dialog visible={newProductDialog} header="Add New A Product" modal className="p-fluid w-6" onHide={() => !loading && setNewProductDialog(false)} footer={footerBodyTemplate}>
                        <form>
                            <div className="field">
                                <label htmlFor="name" className="font-medium">
                                    Title
                                </label>
                                <InputText id="name" {...form.register('title', { required: 'Title is required' })} />
                                {errors.title?.type === 'required' && <p className="text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="field">
                                <label htmlFor="description" className="font-medium">
                                    Description
                                </label>
                                <InputTextarea id="description" {...form.register('description', { required: 'Description is required' })} rows={3} cols={20} />
                                {errors.description?.type === 'required' && <p className="text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="field">
                                <label className="mb-3 font-medium">Producer</label>
                                <Controller
                                    control={form.control}
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

                            <div className="field">
                                <Controller
                                    name="saleRate"
                                    control={form.control}
                                    rules={{
                                        required: 'Sale Rate is required',
                                        validate: (value) => (parseInt(value!) > 0 && parseInt(value!) < 100) || 'Enter valid sale rate 0% - 100%'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className="mb-2 font-medium">
                                                Sale Rate (%)
                                            </label>
                                            <InputNumber id={field.name} inputRef={field.ref} value={field.value!} onBlur={field.onBlur} onValueChange={(e: any) => field.onChange(e)} useGrouping={false} prefix="%" />
                                        </>
                                    )}
                                />
                                {errors.saleRate?.type === 'required' && <p className="text-red-500">{errors.saleRate.message}</p>}
                                {errors.saleRate?.type === 'validate' && <p className="text-red-500">{errors.saleRate.message}</p>}
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <Controller
                                        name="oldPrice"
                                        control={form.control}
                                        rules={{
                                            required: 'Price is required',
                                            validate: (value) => value! > 0 || 'Enter valid price'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label htmlFor={field.name} className="mb-2 font-medium">
                                                    Price
                                                </label>
                                                <InputNumber id={field.name} inputRef={field.ref} value={field.value} onBlur={field.onBlur} onValueChange={(e) => field.onChange(e)} mode="currency" currency="VND" locale="en-US" useGrouping={false} />
                                            </>
                                        )}
                                    />
                                    {errors.oldPrice?.type === 'required' && <p className="text-red-500">{errors.oldPrice.message}</p>}
                                    {errors.oldPrice?.type === 'validate' && <p className="text-red-500">{errors.oldPrice.message}</p>}
                                </div>
                                <div className="field col">
                                    <Controller
                                        name="quantity"
                                        control={form.control}
                                        rules={{
                                            required: 'Quantity is required',
                                            validate: (value) => value! > 0 || 'Enter valid quantity'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label htmlFor={field.name} className="mb-2 font-medium">
                                                    Quantity
                                                </label>
                                                <InputNumber id={field.name} inputRef={field.ref} value={field.value} onBlur={field.onBlur} onValueChange={(e) => field.onChange(e)} useGrouping={false} />
                                            </>
                                        )}
                                    />
                                    {errors.quantity?.type === 'required' && <p className="text-red-500">{errors.quantity.message}</p>}
                                    {errors.quantity?.type === 'validate' && <p className="text-red-500">{errors.quantity.message}</p>}
                                </div>
                            </div>

                            <div className="formgrid grid">
                                {PROPERTIES[selectedType?.id! - 1].map((property) => (
                                    <div className="col-6 mt-2" key={property.id}>
                                        {!property.isText ? (
                                            <div>
                                                <label htmlFor={property.name} className="font-medium text-transform: capitalize">
                                                    {property.name}
                                                </label>
                                                <InputText {...form.register(`${'properties.' + property.name}`, { required: 'properties is required' })} className=" mr-3 mt-2" />
                                            </div>
                                        ) : (
                                            <div className="">
                                                <div className="mb-2" s>
                                                    <label htmlFor={property.name} className="font-medium text-transform: capitalize">
                                                        {property.name}
                                                    </label>
                                                </div>
                                                <Controller
                                                    control={form.control}
                                                    name={`${'properties.' + property.name}`}
                                                    rules={{ required: 'Producer is required' }}
                                                    render={({ field }) => (
                                                        <div className="formgrid grid">
                                                            {options.map((producer) => (
                                                                <div className="field-radiobutton col-6" key={producer.id}>
                                                                    <RadioButton inputId={producer.name} {...field} value={producer.value} inputRef={field.ref} name={producer.name} checked={producer.value == field.value} />
                                                                    <label htmlFor={producer.name} className="cursor-pointer">
                                                                        {producer.name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                ></Controller>

                                                {errors.properties?.type === 'required' && <p className="text-red-500">{errors.properties.message}</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="field mt-3">
                                <label className="mb-3 font-medium">Image</label>
                                <FileUpload name="files" customUpload multiple accept="image/*" maxFileSize={1000000} uploadHandler={invoiceUploadImageHandler} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                            </div>
                            <div className="field mt-3">
                                <label className="mb-3 font-medium">Preview Image</label>
                                <FileUpload name="files" customUpload multiple accept="image/*" maxFileSize={1000000} uploadHandler={invoiceUploadPreviewImageHandler} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                            </div>
                        </form>
                    </Dialog>
                    <ActionsProduct product={product} productDialog={productDialog} isEdit={isEdit} setProductDialog={setProductDialog}></ActionsProduct>

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

                    {/* <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog> */}
                </div>
            </div>
        </div>
    );
};

export default Crud;
