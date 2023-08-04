import React, { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { webRouter } from './index';
import { useMemo } from 'react';
import { userStore } from '@/store';
import commonContext from '@/utils/commonContext';

function checkoutMenu(router: any, consumer: any) {
    const allowKeyList = consumer.map((item: any) => item.name);
    const routerArr = router.filter((item: any) => {
        return item.id === 'default' || allowKeyList.includes(item.name);
    });
    return routerArr;
}

function App() {
    const consumer = useContext(commonContext);
    const { user_info } = userStore();

    const routers: Array<any> = useMemo(() => {
        return checkoutMenu([...webRouter], consumer);
    }, [user_info]);

    const routesElement = useRoutes([...routers]);

    return routesElement;
}

export default App;
