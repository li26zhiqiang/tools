/* eslint-disable no-console */
import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { HashRouter } from 'react-router-dom';
import AppLayout from './pages/App';
import Router from './routers/Router';
import AuthRouter from './routers/authRouter';
import Global from './components/Global';
import OpenAiLogo from './components/OpenAiLogo';
import actions from './actions';
import { ROOT_PATH } from '@utils/constants';
import { getUserInfo } from './utils/actions';
import { Provider } from './utils/commonContext';

import '@/styles/global.less';
import '@/styles/markdown.less';
import '@/styles/highlight.less';

let rootNode: any = null;

function getSubRootContainer(container: any): Element {
    return container ? container.querySelector('#root_aitools') : document.querySelector('#root_aitools');
}

async function renderApp(props: Record<string, any>) {
    const { container } = props;
    const dom = getSubRootContainer(container);
    rootNode = ReactDOM.createRoot(dom);
    let menus = [];

    let resp: any;
    resp = await getUserInfo();

    if (resp && resp.code === 200) {
        menus = resp.data.menus || [];
    }

    rootNode.render(
        <ConfigProvider theme={{ token: { colorPrimary: '#18b3b3' } }}>
            <Provider value={menus}>
                <HashRouter>
                    <AuthRouter>
                        <Global>
                            <AppLayout>
                                <React.Suspense
                                    fallback={
                                        <div
                                            style={{
                                                width: '100vw',
                                                height: '100vh',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <OpenAiLogo rotate width="3em" height="3em" />
                                        </div>
                                    }
                                >
                                    <Router />
                                </React.Suspense>
                            </AppLayout>
                        </Global>
                    </AuthRouter>
                </HashRouter>
            </Provider>
        </ConfigProvider>
    );
}

function render(props: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
        if (!window.location.pathname.startsWith(ROOT_PATH)) {
            const newPath = ROOT_PATH + window.location.pathname;
            const url = window.location.href.replace(window.location.pathname, newPath);

            window.location.href = url;
        } else {
            renderApp(props);
        }
    } else {
        renderApp(props);
    }
}

function storeTest(props: Record<string, any>) {
    if (props) {
        actions.setAction(props);
        actions.onGlobalStateChange(
            (value: any, prev: any) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
            true
        );
    }
}

if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}

export async function bootstrap() {
    //
}

export async function mount(props: Record<string, any>) {
    storeTest(props);
    render(props);
}

export async function unmount() {
    rootNode?.unmount();
    rootNode = null;
}
