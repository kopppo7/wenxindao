// 如果有其它配置项则在下面新增并 export
// const DOMAIN = 'https://wenxin.wxdao.net/user'//'http://192.168.0.104:8003';//
// const ORDER = 'https://wenxin.wxdao.net/order';//'http://192.168.0.104:8001'//
// const ADMIN = 'https://wenxin.wxdao.net/admin';//'http://192.168.0.104:8001'//

const DOMAIN = 'http://172.16.152.49:8003'
const ORDER = 'http://172.16.152.49:8001';
const ADMIN = 'http://172.16.152.49:8002';

// const DOMAIN = 'http://49.4.7.56:8003'
// const ORDER = 'http://49.4.7.56:8001';
// const ADMIN = 'http://49.4.7.56:8002';
export default {
    getDomain: DOMAIN,
    getOrder: ORDER,
    ADMIN
}
