/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { AccountContext } from './context/accountcontext';
import DeleteCookie from '../app/(main)/utilities/cookies/deleteCookie';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const menuRight = useRef(null);
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const { user } = useContext(AccountContext);
    const router = useRouter();
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));
    const items = [
        {
            label: 'ADMIN',
            items: [
                {
                    label: user?.name,
                    icon: 'pi pi-user'
                },
                {
                    label: user?.email,
                    icon: 'pi pi-envelope'
                },
                {
                    label: 'Log out',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        DeleteCookie('user');
                        router.push('/auth/login');
                    }
                }
            ]
        }
    ];
    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={(event) => menuRight.current?.toggle(event)}>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </div>
            <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
