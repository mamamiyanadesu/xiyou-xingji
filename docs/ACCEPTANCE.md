# 参赛闭环验收记录

日期：2026-09-20 19:16 CST（本地验收），2026-09-20 19:45 CST（线上真实验收）。
工作分支：`feat/competition-ready`，已于 2026-09-20 20:16 推送至远端（`863831d`，上游跟踪已设置，`main` 保持 `854e862` 未动）。已发布到 `gh-pages`（`5507e61`；换 AK 后为 `ea30827`）。

本记录基于当前工作区文件、命令输出和真实浏览器验收；未依赖旧对话结论。

## 当前工作区

- 提交历史：`07af989`（参赛收口，含状态 v2、POI 确认、路线绘制、来源页返回、损坏恢复、接入浏览器端 AK）叠在 `854e862`（三站试读原型）之上。
- 提交范围：`README.md`、`dist/app.js`、`dist/config.js`、`dist/maps.js`、`dist/sources.html`、`dist/state.mjs` 修改；`dist/navigation.mjs`、`dist/request-guard.mjs`、`dist/source-return.js`、`docs/ACCEPTANCE.md`、`docs/HANDOFF-2026-09-20.md`、`docs/PRD-v1.0.md`、`tests/backup-v1.json`、`tests/navigation.test.mjs`、`tests/recovery.test.mjs`、`tests/request-guard.test.mjs`、`tests/source-return.test.mjs` 新增。
- 当前目录没有 `package.json`；可用命令来自 README：`node server.mjs`、`node --test tests/*.test.mjs`。
- 环境注意：在沙箱隔离下执行 git 写操作会残留 `.git/*.lock`，导致下一条 git 命令失败。清锁命令 `find .git -name '*.lock' -delete`，且 git 收口须在沙箱外权限下运行。


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

## 线上真实验收（2026-09-20 19:45 CST）

发布方式：`git subtree push --prefix dist origin gh-pages`，快进更新 `985c328..5507e61`，未经强推。GitHub Pages 构建状态 `built`，耗时约 31.8 秒。

验证环境：真实浏览器新会话，无 `sessionStorage` AK，仅依赖线上 `config.js` 的公开浏览器 AK。

- 资源可达性：线上 `index.html`、`navigation.mjs`、`request-guard.mjs`、`source-return.js`、`state.mjs`、`maps.js`、`sources.html`、`style.css` 全部 HTTP 200。此前缺失的三个新文件已上线。
- 线上 `config.js` 已带上浏览器端 AK，HTTP 200。
- AK 链路：百度 JSAPI `getscript` 端点返回正常脚本，无 `APP REFERER ERROR`、无 AK 校验失败。
- 真实地图渲染：进入「现实地图」后点击「地图中查看」，`window.BMapGL` 为 object，地图容器出现 canvas，页面显示百度版权与水印信息，真实瓦片正常绘制。
- 真实 POI 搜索：搜索「玄奘广场」返回 5 条真实候选（玄奘法师铜像、玄奘纪念馆(西安店)、玄奘三藏院、唐玄奘大型4d体验剧项目组委会、玄武门广场）；搜索「唐城墙遗址公园」返回 5 条真实候选。候选不唯一时程序要求用户确认，符合设计。
- 真实路线服务：确认 `玄奘法师铜像` 与 `唐城墙遗址公园` 后计算步行路线，页面显示「游览共 105 分钟 ＋ 交通 116 分钟 ＝ 221 分钟」及「玄奘法师铜像 → 唐城墙遗址公园：8.1 公里，116 分钟」。
- 真实路线图渲染：行程页出现百度地图 canvas 与真实步行路线折线，截图见 `/tmp/xiyou-live-route-2.png`。
- 分段导航链接：使用确认后的真实坐标生成，例如
  `https://api.map.baidu.com/direction?origin=latlng:34.222217424496144,108.97063796377019|name:玄奘法师铜像&destination=latlng:34.2267769510005,108.89541727392559|name:唐城墙遗址公园&mode=walking&coord_type=bd09ll&output=html&src=webapp.xiyouxingji`
- 行程状态：加入两站后导航角标显示 2，刷新前状态与行程页渲染一致。

截图证据：`/tmp/xiyou-live-map-1.png`（线上地图渲染）、`/tmp/xiyou-live-route-2.png`（线上真实路线折线）。

## 更换浏览器端 AK 后的重验（2026-09-20 20:15 CST）

旧浏览器端 AK 弃用，`dist/config.js` 换成新的浏览器端 AK。发布链路：

- 提交 `61ced23`（`dist/config.js` 换 AK + `DEPLOY.md` 章节调整）。
- `git subtree push --prefix dist origin gh-pages`：`5507e61..ea30827`，快进，未强推。
- Pages 构建 `built`，耗时约 40.9 秒。
- 线上 `config.js` 抓取确认已带新 AK，HTTP 200。

验证环境：真实浏览器新会话，无 `sessionStorage` 覆盖，AK 来自线上 `config.js`。

- 地图 SDK：`BMapGL` 为 object，请求 URL 中 AK 为新值（`api.map.baidu.com/api?v=4.0&ak=<新AK>&callback=xiyouMapReady`）。
- 地图渲染：地图容器出 canvas，百度版权水印正常。
- 真实 POI 搜索：搜索「玄奘广场」返回 5 条真实候选（玄奘法师铜像、玄奘纪念馆(西安店)、玄奘三藏院、唐玄奘大型4d体验剧项目组委会、玄武门广场）。
- 无错误态：页面未出现重试按钮，无 `APP REFERER ERROR`。

截图证据：`/tmp/xiyou-newak-map.png`。

**白名单状态说明**：`api.map.baidu.com/getscript` 端点实测对带正确 Referer、无 Referer、错误 Referer 三种请求均返回正常脚本，因此**白名单是否已生效无法用 curl 判定**，只能在百度控制台核对，并以浏览器实测为准。新 AK 在无白名单收紧的状态下可用，属偏宽松状态。

## 仍未验证

- 外部百度导航页面实际打开后的展示：已验证 URL 生成含真实坐标，但未在浏览器中实开百度页面。
- 定位辅助真实浏览器权限、精度不足和 200 米判断：未用真实地理位置测试；P0 可用手动到访覆盖。
- 线上手动文牒记录、刷新恢复、备份恢复、四视口响应式的线上重跑：本地已验收，线上未重跑。
- Referer 白名单收紧后的回归：当前新 AK 在未收紧状态下可用；白名单写入 GitHub Pages 域名后需重跑一次线上地图与路线。

## 剩余阻塞

- 浏览器端 AK 的 Referer 白名单尚未确认写入百度控制台。当前 AK 可无 Referer 调用，属于偏宽松状态；应在控制台按百度格式（单框、英文逗号分隔、支持通配符）填 `*.mamamiyanadesu.github.io*`，收紧后重跑线上回归。
- 部署域名已确认为 `mamamiyanadesu.github.io`（2026-09-20 用户确认），`DEPLOY.md` 占位已替换完毕。
- 旧浏览器端 AK 已弃用，应从百度控制台删除或停用，避免遗留可用凭据。

## 下一步

1. 在百度控制台为该浏览器端 AK 写入 Referer 白名单，只放实际部署域名，不使用 `*` 通配。
2. 白名单生效后，用无 `sessionStorage` 的新会话重跑线上 P0：新访客故事到 POI、两站真实路线、手动文牒、刷新恢复、备份恢复、390/430/768/1440 视口。
3. 如需把后续改动再次上线，继续用 `git subtree push --prefix dist origin gh-pages`，不要强推。

