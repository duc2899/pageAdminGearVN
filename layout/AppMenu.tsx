/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Manager Users',
            items: [{ label: 'Account User', icon: 'pi pi-users', to: '/uikit/accountUser' }]
        },
        {
            label: 'Manager Products',
            items: [{ label: 'Products', icon: 'pi pi-database', to: '/uikit/products', badge: 'NEW' }]
        },
        {
            label: 'Manager Orders',
            items: [{ label: 'Orders', icon: 'pi pi-box', to: '/uikit/orders', badge: 'NEW' }]
        },
        {
            label: 'Manager Discount Code',
            items: [{ label: 'Discount Code', icon: 'pi pi-tag', to: '/uikit/discountCode', badge: 'NEW' }]
        },
        {
            label: 'Manager Feedbacks',
            items: [{ label: 'Feedbacks', icon: 'pi pi-box', to: '/uikit/feedbacks', badge: 'NEW' }]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
