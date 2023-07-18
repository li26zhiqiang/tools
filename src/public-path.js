/* eslint-disable no-undef */
/* eslint-disable camelcase */
import app from '@utils/app';

if (window.__POWERED_BY_QIANKUN__) {
    let moduleName = `${app.name}/`;

    if (window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__.endsWith(`/${app.name}/`)) {
        moduleName = '';
    }

    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + moduleName;
}
