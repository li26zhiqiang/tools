import request from '../request/index';

// 获取用户权限
export function getUserInfo() {
    return request.get('/tytech-account/account/info');
}
