import React from 'react';
import { useRoutes } from 'react-router-dom';
import NotFound from './NotFound';

const Routers = (props: Record<string, any>) => {
    const { routes } = props;

    return useRoutes([
        ...routes,
        {
            name: 'error',
            path: '*',
            element: <NotFound />
        }
    ]);
};

export default Routers;
