# app-ais-aftersale-front 新销服-售后服务子应用
## 项目初始化
``` bash
# 克隆项目命令
git clone -b develop --recurse-submodules http://git-external.leapmotor.com/business-front/webx/lxp-micro-sub-app.git
```
其余步骤参考[PC端子应用开发流程](https://wiki-intra.leapmotor.com/pages/viewpage.action?pageId=97819126)

## 基础代码生成
### 脚本生成
模板文件存放在src/templates下
``` bash
# x 为后端模块名称
node .\bin\generate.js -- x
```
- views下生成x文件夹，里面包含列表页、详情页
- api下生成x.js
- src/router/index.js中生成列表页、详情页路由

### vscode插件生成
参考文档[vscode插件使用及开发](https://wiki-intra.leapmotor.com/pages/viewpage.action?pageId=97842088)