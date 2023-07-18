import React from 'react';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import Menu from '../Menu';
import Routers from '../Routers';

import './index.less';

export default (props: Record<string, any>) => {
    const { routes, menus, mode } = props;
    const Router = mode === 'hash' ? HashRouter : BrowserRouter;

    return (
        <div>
            <div className="general-page-container">
                <aside className="left">
                    <Menu menus={menus} />
                </aside>
                <main className="right">
                    <section>
                        <Routers routes={routes} />
                    </section>
                </main>
            </div>
        </div>
    );
};
