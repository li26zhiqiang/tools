import React, { useState, useEffect } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import './index.less';

const App = (props: Record<string, any>) => {
    const { menus: items } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
    const location = useLocation();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    function onSelect({ selectedKeys: _keys }: Record<string, any>) {
        setSelectedKeys(_keys);
    }

    function getChildrenMenus(menus: Record<string, any>[]) {
        return menus.map((item: Record<string, any>) => {
            if (!item.children?.length) {
                delete item.children;
            }

            const { key, icon, label, children, path } = item;

            if (children?.length) {
                return (
                    <Menu.SubMenu key={key} {...{ icon, label }}>
                        {getChildrenMenus(children)}
                    </Menu.SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={key} {...{ icon, label }}>
                        <Link to={path}>{label}</Link>
                    </Menu.Item>
                );
            }
        });
    }

    useEffect(() => {
        if (location.pathname === '/') {
            setSelectedKeys(['home']);
        } else {
            const key = location.pathname?.split('/')?.[1];

            if (key && !selectedKeys.includes(key)) {
                setSelectedKeys([key]);
            }
        }
    }, [location.pathname]);

    return (
        <div className={`accordion-menu-container ${collapsed ? 'collapsed' : ''}`}>
            <div className="top">{collapsed ? <AppstoreOutlined /> : '资源管理'}</div>
            <div className="center">
                <Menu
                    defaultSelectedKeys={['home']}
                    selectedKeys={selectedKeys}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    onSelect={onSelect}
                >
                    <>{getChildrenMenus(items)}</>
                </Menu>
            </div>
            <div className="bottom">
                <div className="operation" onClick={toggleCollapsed}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
            </div>
        </div>
    );
};
export default App;
