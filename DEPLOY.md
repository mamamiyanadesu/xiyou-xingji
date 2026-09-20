# 部署与百度地图白名单

## 1. 部署到 GitHub Pages

站点在 `dist/`，GitHub Pages 部署到独立 `gh-pages` 分支：

```bash
git add -A
git commit -m "site: xiyou xingji prototype"
git subtree push --prefix dist origin gh-pages
```

然后到仓库 Settings → Pages，选择 `Deploy from a branch`，分支选 `gh-pages`、目录 `/ (root)`。

**当前部署状态（2026-09-20 已生效）**

- 仓库：`mamamiyanadesu/xiyou-xingji`（public）
- Pages source：`gh-pages` 分支 / `(root)`，`https_enforced: true`
- 线上地址：https://mamamiyanadesu.github.io/xiyou-xingji/

注意：Pages 的 source 是 `gh-pages`，**推 `main` 或功能分支不会触发部署**，只有 `git subtree push --prefix dist origin gh-pages` 会。

## 2. 创建浏览器端 AK

进入百度地图开放平台控制台「应用管理 → 我的应用 → 创建应用」，应用类型选「浏览器端」，启用 JavaScript API。

## 3. 加入 Referer 白名单

在 AK 的「Referer 白名单」输入框里按百度规定的格式填写。规则是：**单个输入框，多个域名用英文半角逗号分隔**，支持通配符，例：`*.mysite.com*,*myapp.com*`。

本项目填这一条即可：

```text
*.mamamiyanadesu.github.io*
```

- 开头的 `*` 覆盖协议（`https://`），结尾的 `*` 覆盖路径。一条同时匹配 `https://mamamiyanadesu.github.io` 与 `https://mamamiyanadesu.github.io/xiyou-xingji/`（及其子路径），不需要写成两条。
- 想收得更紧，只允许本项目路径：`*.mamamiyanadesu.github.io/xiyou-xingji*`。

注意事项：

- **不要填单个 `*`**。那等于不做任何限制，前端 AK 会被任意网站盗用。
- 不要一行一个域名，控制台按英文逗号解析。
- 白名单只放你实际部署的域名。

## 4. 验证

部署后用浏览器打开线上地址，进入「现实地图」。若仍提示地图未就绪，按 F12 查看控制台：`APP REFERER ERROR` 表示当前域名不在白名单，AK 校验错误则先核对 AK 是否启用 JavaScript API。

## 5. 改 AK 或白名单后的回归

1. 百度控制台改完白名单，等 1～2 分钟生效。
2. 打开线上地址，进入「现实地图」，确认：地图 SDK 加载成功、真实 POI 可搜索、两站真实路线可计算、路线图渲染出折线。
3. 若报 `APP REFERER ERROR`，说明当前域名不在白名单；若 AK 校验失败，核对 AK 是否启用了 JavaScript API、类型是否为「浏览器端」。

### 换 AK 与改白名单的区别

- **只改白名单**：校验在百度侧完成，不用重发站点，改完等生效即可。
- **换 AK**：`dist/config.js` 里的值变了，必须重新执行第 1 节的 `git subtree push --prefix dist origin gh-pages`，线上才会拿到新 AK。

## 关于密钥

- 站点使用**浏览器端** JSAPI AK，值写在 `dist/config.js` 的 `baiduAk`，随静态站点公开。浏览器端 AK 对访客本来就是可见的，这不是泄露；真正的访问边界是 Referer 白名单。
- **该 AK 已进入 Git 并已上线**（`dist/config.js`，2026-09-20）。
- 演示或临时换 AK，用站内「配置地图服务」写入当前标签页的 `sessionStorage`，优先级高于 `config.js`，关闭标签页即失效。
- **绝对不要**把服务端 SK、MCP 密钥或任何非浏览器端凭据放进 `config.js` 或任何会进 Git 的文件。本机用于百度地图 MCP 的那个 AK 是服务端类型，不能拿来填这里。
