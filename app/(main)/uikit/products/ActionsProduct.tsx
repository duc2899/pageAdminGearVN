import React, { useEffect, useState } from 'react';
import { Category, Demo, Producer } from '../../../../types/demo';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { CategoryAPI } from '../../../store/services/CategoryServices/CategoryAPI';
import { ProducerAPI } from '../../../store/services/ProducerServices/ProducerAPI';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface OptionActionsProduct {
    product: Demo.Product | undefined;
    productDialog: boolean | undefined;
    setProductDialog: any;
}
function ActionsProduct({ product, productDialog, setProductDialog }: OptionActionsProduct) {
    const [categories, setCategories] = useState<Category.Category[]>([]);
    const [producers, setProducers] = useState<Producer.Producer[]>([]);
    useEffect(() => {
        CategoryAPI.getCategory().then((data) => setCategories(data));
        ProducerAPI.getProducer().then((data) => setProducers(data));
    }, []);
    const footerBodyTemplate = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" autoFocus />
            </div>
        );
    };
    return (
        <Dialog visible={productDialog} header="Product Details" modal className="p-fluid w-6" onHide={() => setProductDialog(false)} footer={footerBodyTemplate}>
            {product?.image && <img src={`${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block" />}
            {product?.previewImages.length! > 0 && (
                <>
                    <label htmlFor="previewImage" className="font-medium">
                        Preview Images
                    </label>
                    <div className="flex align-items-center justify-content-center">
                        {product?.previewImages.map((image) => (
                            <div key={image.id}>
                                <img src={`${image.image}`} alt={image.image} width="90" style={{ objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </>
            )}
            {product?.id && (
                <div className="field">
                    <label htmlFor="id" className="font-medium">
                        ID
                    </label>
                    <InputNumber id="id" value={product?.id} />
                </div>
            )}
            <div className="field">
                <label htmlFor="name" className="font-medium">
                    Name
                </label>
                <InputText
                    id="name"
                    value={product?.title}
                    // onChange={(e) => onInputChange(e, 'name')}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="description" className="font-medium">
                    Description
                </label>
                <InputTextarea id="description" value={product?.description} required rows={3} cols={20} />
            </div>

            <div className="field">
                <label className="mb-3 font-medium">Category</label>
                <div className="formgrid grid">
                    {categories?.map((category) => (
                        <div className="field-radiobutton col-6" key={category.id}>
                            <RadioButton inputId="category1" name="category" value="Accessories" checked={product?.type === category.name} />
                            <label htmlFor="category1">{category.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="field">
                <label className="mb-3 font-medium">Producer</label>
                <div className="formgrid grid">
                    {producers?.map((producer) => (
                        <div className="field-radiobutton col-6" key={producer.id}>
                            <RadioButton inputId="category1" name="category" value="Accessories" checked={product?.producer === producer.name} />
                            <label htmlFor="category1">{producer.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="price" className="font-medium">
                        Price
                    </label>
                    <InputNumber id="price" value={product?.oldPrice} mode="currency" currency="VND" locale="en-US" />
                </div>
                <div className="field col">
                    <label htmlFor="quantity" className="font-medium">
                        Quantity
                    </label>
                    <InputNumber id="quantity" value={product?.quantity} />
                </div>
            </div>

            <div className="formgrid grid">
                {product?.properties?.map((property) => (
                    <div className="col-6 mt-2" key={property.id}>
                        <div className="w-fit mb-2">
                            <label htmlFor="property" className="font-medium block">
                                {property.name}
                            </label>
                        </div>
                        <InputText id="property" className="w-fit" value={property.properties} />
                    </div>
                ))}
            </div>
        </Dialog>
    );
}

export default ActionsProduct;
