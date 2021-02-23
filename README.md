## 前端配置说明
#### 配置请求api
打开vue.config.js 将xxx.xxx.xxx 替换成自己的域名
```js
proxy: {
            '/api': {
                target: 'https://xxx.xxxx.xxx/index.php?s=/api/',  // target host
                ws: true,  // proxy websockets
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': ''  // rewrite path
                }
            },
        }
```

#### 配置对应系统唯一标识
打开siteinfo.js 将10001改成新系统版本,如果您不需要多个系统将不必更改此文件
```
module.exports = {
  name: "赋能",
  wxappId: "10001", // 此处为系统ID, 可在超管后台-列表中查看
};
```

## 打包项目
#### 前端为Vue编写,旨在前后端分离后,一个后台部署多个前端的实现,因此需要安装nodejs环境和vue-cli脚手架
