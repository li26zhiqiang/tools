import React, { useEffect } from 'react';
import { MenuProps } from 'antd';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';

import { ChatsInfo } from '@/types';
import { configStore } from '@/store';

import './index.less';

type Props = {
    menuExtraRender?: () => React.ReactNode;
    route?: {
        path: string;
        routes: Array<ChatsInfo>;
    };
    menuItemRender?: (
        item: MenuDataItem & {
            isUrl: boolean;
            onClick: () => void;
        },
        defaultDom: React.ReactNode,
        menuProps: MenuProps | any
    ) => React.ReactNode | undefined;
    menuDataRender?: (menuData: MenuDataItem[]) => MenuDataItem[];
    menuFooterRender?: (props?: any) => React.ReactNode;
    menuProps?: MenuProps;
    children?: React.ReactNode;
};

function Layout(props: Props) {
    const { menuExtraRender = () => <></>, menuItemRender = () => undefined } = props;

    const { website_logo, website_title, website_footer, website_description, website_keywords } = configStore();

    function createMetaElement(key: string, value: string) {
        const isMeta = document.querySelector(`meta[name="${key}"]`);
        if (!isMeta) {
            const head = document.querySelector('head');
            const meta = document.createElement('meta');
            meta.name = key;
            meta.content = value;
            head?.appendChild(meta);
        }
    }

    useEffect(() => {
        createMetaElement('description', website_description);
        createMetaElement('keywords', website_keywords);
    }, []);

    return (
        <ProLayout
            className="right-container"
            title=""
            logo={null}
            layout="side"
            splitMenus={false}
            contentWidth="Fluid"
            fixedHeader
            fixSiderbar={false}
            menuHeaderRender={false}
            token={{
                bgLayout: 'transparent',
                // sider: {
                //     colorTextMenuTitle: '#191919',
                //     colorMenuBackground: '#ffffff',
                //     colorMenuItemDivider: '#dfdfdf',
                //     colorTextMenu: '#191919',
                //     colorTextMenuSelected: '#18b3b3',
                //     colorTextMenuActive: '#18b3b3',
                //     colorTextMenuItemHover: '#18b3b3',
                //     colorBgMenuItemHover: '#e1f2ef',
                //     colorBgMenuItemSelected: '#e1f2ef'
                // },
                pageContainer: {
                    paddingBlockPageContainerContent: 20,
                    paddingInlinePageContainerContent: 20,
                    colorBgPageContainer: '#fff',
                    colorBgPageContainerFixed: '#fff'
                }
            }}
            headerRender={() => <></>}
            menu={{
                hideMenuWhenCollapsed: true,
                locale: false,
                collapsedShowGroupTitle: false
            }}
            suppressSiderWhenMenuEmpty
            siderWidth={252}
            route={props.route}
            menuProps={props.menuProps}
            menuExtraRender={menuExtraRender}
            menuItemRender={menuItemRender}
            menuDataRender={props.menuDataRender}
            menuFooterRender={(p) => {
                return (
                    <div>
                        {props.menuFooterRender?.(p)}
                        {website_footer && (
                            <div
                                style={{
                                    marginTop: 12
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: website_footer
                                }}
                            />
                        )}
                    </div>
                );
            }}
            breadcrumbRender={() => []}
            collapsedButtonRender={() => {
                return <></>;
            }}
            collapsed={false}
        >
            {props.children}
        </ProLayout>
    );
}

export default Layout;
