import React, { useContext } from 'react';
import { CrownFilled, SmileFilled } from '@ant-design/icons';
import commonContext from '@/utils/commonContext';

export default function DefaultProps() {
    let consumer: any;
    consumer = useContext(commonContext);
    const allowKeyList = consumer.map((item: any) => item.name);

    const router = [
        {
            path: '/talk',
            name: '对话',
            pathName: 'talk',
            icon: <SmileFilled />
        },
        {
            path: '/draw',
            name: '绘画',
            pathName: 'draw',
            icon: <CrownFilled />
        }
    ];

    const routeList = router.filter((item) => {
        return allowKeyList.includes(item.pathName);
    });

    return {
        title: 'AI神器',
        fixSiderbar: true,
        colorPrimary: '#18b3b3',
        splitMenus: false,
        fixedHeader: false,
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
            routes: routeList
        }
    };
}
