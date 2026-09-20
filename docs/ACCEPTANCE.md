# 参赛闭环验收记录

日期：2026-09-20 19:16 CST。工作分支：`feat/competition-ready`。

本记录仅基于当前工作区文件、命令输出和本轮本地浏览器验收；未依赖旧对话结论。未推送、未部署、未发布。

## 当前工作区

- `git status --short --branch`：`README.md`、`dist/app.js`、`dist/maps.js`、`dist/sources.html`、`dist/state.mjs` 已修改；`dist/navigation.mjs`、`dist/request-guard.mjs`、`dist/source-return.js`、`docs/ACCEPTANCE.md`、`docs/PRD-v1.0.md`、`tests/backup-v1.json`、`tests/navigation.test.mjs`、`tests/recovery.test.mjs`、`tests/request-guard.test.mjs`、`tests/source-return.test.mjs` 未跟踪。
- 当前目录没有 `package.json`；可用命令来自 README：`node server.mjs`、`node --test tests/*.test.mjs`。

## 已验证

- 单元测试：`node --test tests/*.test.mjs`，15/15 通过。
- 语法检查：`node --check dist/app.js` 通过；`node --check dist/maps.js` 通过。
- 本地预览：`node server.mjs` 在沙箱外启动，地址 `http://127.0.0.1:49229/`。
- 首屏行为：浏览器打开本地预览，标题为“西游行记 · 读进山河”，故事长卷、现实地图、我的行程、通关文牒入口可见。
- 隔离记录持久化：清空 `xiyou-xingji-v1` 后，通过 UI 标记长安已读、保存“隔离验收：刷新恢复测试”、手动记录玄奘广场到访；刷新后 localStorage 仍为 v2，`read.changan=true`，心得和手动到访保留。
- 损坏恢复：先将 localStorage 写成 `{broken`，再通过 UI 导入 `tests/backup-v1.json`；弹窗显示“1 个已读标记、2 个行程地点、1 条到访记录”，确认后迁移到 v2，刷新后心得“隔离验收备份，不代表真实到访。”与“玄奘广场 · 手动记录”恢复，损坏提示消失。
- 无 AK 地图降级：无 `sessionStorage` AK 且 `dist/config.js` 为空时，地图页显示“地图尚未配置”，同时存在 `#retry-service` 和 `setup.html` 配置入口。
- 来源页返回：从 `#story=nvguo&view=map` 进入 `sources.html`，返回链接为 `index.html#story=nvguo&view=map`，并由 `source-return.js` 白名单限制。
- 已确认 POI 前端恢复与路线图：在隔离 localStorage 写入玄奘广场、唐城墙遗址公园确认坐标并刷新后，浏览器 mock 百度 SDK 计算路线，页面显示“游览共 105 分钟 ＋ 交通 16 分钟 ＝ 121 分钟”，路线图容器存在，视口点为 3，导航链接使用 `latlng:34.2151,108.9701` 到 `latlng:34.2059,108.8935` 的确认坐标。
- 响应式：浏览器检查 390x844、430x932、768x1024、1440x900 四个视口，故事页与行程页均无横向溢出；故事页抽样按钮、链接、标题和节点没有超出视口。

## 已实现但需外部条件复验

- v1 到 v2 状态迁移，新增确认 POI、出行方式和预算字段。
- 页面选择 POI 后写入持久状态，启动时恢复确认地点。
- 有效备份使用独立恢复函数，可以解除损坏数据导致的普通写入保护。
- 候选坐标校验、地区研究入口禁止加入行程、导出过滤额外字段。
- 分段导航链接与真实路线几何绘制代码。
- 加入行程反馈、心得草稿离开提醒、部分过期请求及建议失效保护。

## 未验证

- 真实百度 JSAPI 搜索、真实路线服务、真实路线图渲染：本轮没有可用于公开部署的浏览器 AK，路线图验收使用浏览器 mock SDK，只证明前端状态和绘制链路。
- 公开 GitHub Pages 新访客可用地图：`dist/config.js` 当前仍为 `window.XIYOU_CONFIG = { baiduAk: '' };`，没有公开浏览器 AK，不能标记为通过。
- 外部百度导航页面实际打开后的展示：当前已验证 URL 生成，不等于百度页面实测成功。
- 定位辅助真实浏览器权限、精度不足和 200 米判断：未用真实地理位置测试；P0 可用手动到访覆盖。
- 线上版本：本轮未推送、未部署，线上仍不是当前工作区版本。
  - 补充实测（2026-09-20 19:30 复核）：远端已有 `gh-pages` 分支（`985c328`），GitHub Pages 状态 `built`，线上地址 `https://mamamiyanadesu.github.io/xiyou-xingji/` 可访问。线上是旧版，缺少 `navigation.mjs`、`request-guard.mjs`、`source-return.js`，`config.js` 同样为空 AK。因此发布动作是覆盖 gh-pages，不是在 Pages 上从零启用。

## 阻塞

- 公开访客地图配置阻塞于浏览器端百度 AK：需要提供或确认可公开放入静态前端的 JSAPI 浏览器 AK，并在百度控制台限制 GitHub Pages 域名 Referer。不得使用服务端 SK 或 MCP 密钥。
- GitHub Pages 发布阻塞于用户明确授权；本轮硬性边界要求不发布、不部署、不强推。

## 下一步

1. 用户确认公开浏览器 AK 的来源与 Referer 白名单后，写入或注入 `dist/config.js`，再用无 sessionStorage 的新会话验证真实搜索、真实路线和路线图。
2. 获得发布授权后，常规推送当前分支并等待 GitHub Pages 构建；不要强推。
3. 发布后用线上 URL 重跑 P0：新访客故事到 POI、两站路线、手动文牒、刷新恢复、备份恢复、390/430/768/1440 视口。
