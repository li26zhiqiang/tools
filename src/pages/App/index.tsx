import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import defaultProps from './config';
import { ReactComponent as OpenaiSvg } from '@/assets/images/openai.svg';
import { CrownFilled, SmileFilled } from '@ant-design/icons';

import './index.less';

export default (props: Record<string, any>) => {
    const [collapsed, setCollapsed] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
    const location = useLocation();

    useEffect(() => {
        setSelectedKeys([location.pathname]);
    }, []);

    return (
        <div id="test-pro-layout" style={{ height: '100%' }}>
            <ProLayout
                className={`app-container ${!window.__POWERED_BY_QIANKUN__ ? 'dev' : ''}`}
                logo={<OpenaiSvg className="logo-icon" />}
                layout="side"
                navTheme="light"
                contentWidth="Fluid"
                {...defaultProps()}
                menuProps={{
                    selectedKeys,
                    onClick: ({ key }) => {
                        setSelectedKeys([key]);
                    }
                }}
                menuItemRender={(item, dom) => (
                    <Link key={item.key} to={item.path || '/'}>
                        {dom}
                    </Link>
                )}
                collapsed={collapsed}
                collapsedButtonRender={() => {
                    return (
                        <div
                            className="bottom-operation"
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                        >
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </div>
                    );
                }}
            >
                <PageContainer header={{ title: '' }}>{props.children}</PageContainer>
            </ProLayout>
        </div>
    );
};
