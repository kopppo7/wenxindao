# 小程序 AJAX 封装及演示

为了方便开发微信小程序联调类项目，特建立此项目。

## ./utils/api.js

项目所有接口，其中接口地址命名需要加前缀 `url`，接口导出变量需要加前缀 `api`

## ./utils/config.js

项目常用配置项，比如域名等

## ./utils/http.js

项目 AJAX 封装，导出常用方法 fetch 和 post 和 put

## ./pages/index/index.js

接口使用演示
```
import { apiLibraries } from '../../utils/api.js'

...

apiLibraries({
    whatever: 'bulabula'
}).then((response) => {
    if (response.statusCode === 200) {
        this.setData({
            lists: response.data
        })
    }
}).catch((error) => {
    console.log(error);
}).finally(() => {
    console.log('我请求完了')
});
```
