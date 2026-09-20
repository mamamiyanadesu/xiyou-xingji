# 部署与百度地图白名单

## 1. 部署到 GitHub Pages

站点在 `dist/`，GitHub Pages 部署到独立 `gh-pages` 分支：

```bash
git add -A
git commit -m "site: xiyou xingji prototype"
git subtree push --prefix dist origin gh-pages
```

然后在仓库 Settings → Pages 选择 `Deploy from a branch`，分支选 `gh-pages`、目录 `/ (root)`。

线上地址形如：

```text
https://<你的用户名>.github.io/xiyou-xingji/
```

## 2. 创建浏览器端 AK

进入百度地图开放平台控制台「应用管理 → 我的应用 → 创建应用」，应用类型选「浏览器端」，启用 JavaScript API。

## 3. 加入 Referer 白名单

在刚创建的 AK 的「Referer 白名单」里加入两个地址：

```text
https://<你的用户名>.github.io
https://<你的用户名>.github.io/xiyou-xingji/
```

白名单只放你实际部署的域名。不要把 `*` 通配符白名单当作正式发布方案。

## 4. 验证

部署后用浏览器打开线上地址，进入「现实地图」。若仍提示地图未就绪，按 F12 查看控制台：`APP REFERER ERROR` 表示当前域名不在白名单，AK 校验错误则先核对 AK 是否启用 JavaScript API。

## 关于密钥

- `dist/config.js` 里的 `baiduAk` 留空，密钥不进入 Git。
- 演示时用站内「配置地图服务」把 AK 写进当前标签页会话；关闭标签页即失效。
- 浏览器端 AK 对访客可见，必须依赖 Referer 白名单限制来源，不要把服务端 SK 放进网页。
