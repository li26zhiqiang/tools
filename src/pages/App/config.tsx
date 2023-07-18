import { CrownFilled, SmileFilled } from '@ant-design/icons';

export default {
    title: 'AI神器',
    fixSiderbar: true,
    colorPrimary: '#18b3b3',
    splitMenus: false,
    fixedHeader: false,
    // headerRender: false,
    // footerRender: false,
    // siderMenuType: 'sub',
    siderWidth: 216,
    token: {
        bgLayout: '#ebeef5',
        sider: {
            colorTextMenuTitle: '#191919',
            colorMenuBackground: '#ffffff',
            colorMenuItemDivider: '#dfdfdf',
            colorTextMenu: '#191919',
            colorTextMenuSelected: '#18b3b3',
            colorTextMenuActive: '#18b3b3',
            colorTextMenuItemHover: '#18b3b3',
            colorBgMenuItemHover: '#e1f2ef',
            colorBgMenuItemSelected: '#e1f2ef'
        },
        pageContainer: {
            paddingBlockPageContainerContent: 16,
            paddingInlinePageContainerContent: 16,
            colorBgPageContainer: '#ebeef5',
            colorBgPageContainerFixed: '#ebeef5'
        }
    },
    location: {
        pathname: '/'
    },
    route: {
        path: '/',
        routes: [
            {
                path: '/talk',
                name: '对话',
                icon: <SmileFilled />
            },
            {
                path: '/draw',
                name: '绘画',
                icon: <CrownFilled />
            }
        ]
    }
};
