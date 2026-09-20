# 参赛闭环验收记录

日期：2026-09-20 19:16 CST（本地验收），19:45 CST（线上真实验收），20:15 CST（换 AK 后重验），20:46 CST（Referer 白名单生效验证 + 线上 P0 重跑）。
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

**curl 的判定盲区**：`api.map.baidu.com/getscript` 与 `/api` 端点在白名单收紧前后，对带正确 Referer、无 Referer、错误 Referer 三种请求均返回正常脚本，**curl 无法判定白名单状态**，必须用浏览器实测。

## Referer 白名单生效验证（2026-09-20 20:46 CST）

用户在百度控制台填入 `*.mamamiyanadesu.github.io*` 后，用**差分对照实验**证明白名单确实在生效：

| 实验组 | 源 | 加载同一 AK | 结果 |
|---|---|---|---|
| 对照组 | `https://mamamiyanadesu.github.io/xiyou-xingji/` | `api?v=4.0&ak=<AK>` | 地图正常渲染，真实瓦片 / POI / 路线全通 |
| 实验组 | `https://example.com` | 同上 | 百度弹出并阻断：`APP Referer校验失败。请检查该ak设置的白名单与访问所有的域名是否一致。` |

实验组的具体手法：在 `example.com` 页面里劫持 `window.alert` 后注入 JSAPI 脚本，捕获到百度返回的上述错误文案；同时 `BMapGL` 虽被挂载（loader 层不拦），但服务层调用被拒。

**结论**：白名单已生效，域名配置正确；且线上站点在白名单收紧后功能未被破坏。

截图证据：`/tmp/xiyou-whitelist-live.png`（白名单域名下地图正常）、`/tmp/xiyou-whitelist-blocked.png`（非白名单源）。

## 白名单收紧后的线上 P0 重跑（2026-09-20 20:47 CST）

发布版本 `809d60c`，真实浏览器会话：

- P0-1 新访客打开即用：无需自备 AK，地图直接可用。通过。
- P0-2 故事到 POI：进入「现实地图」→「地图中查看」，SDK 加载、canvas 渲染、百度版权水印正常、无重试按钮。通过。
- P0-3 真实 POI 候选：搜索返回 5 条真实候选（玄奘法师铜像、玄奘纪念馆(西安店)、玄奘三藏院、唐玄奘大型4d体验剧项目组委会、玄武门广场）。通过。
- P0-4 两站真实路线：行程含「玄奘广场」「唐城墙遗址公园（延平门）」，点「计算真实交通」得「玄奘法师铜像 → 唐城墙遗址公园：8.1 公里，116 分钟」，「游览共 105 分钟 ＋ 交通 116 分钟 ＝ 221 分钟」。通过。
- P0-5 路线图渲染：行程页地图 canvas 绘出真实步行折线。通过。
- P0-6 分段导航链接：真实坐标 + `coord_type=bd09ll` + `src=webapp.xiyouxingji` 均带齐。~~通过~~ **本项结论已在 21:00 更正，见下节。**

截图证据：`/tmp/xiyou-p0-route.png`。

## 更正：导航出口此前是坏的，已修复并线上验证（2026-09-20 21:00 CST）

上一节把 P0-6 记为「通过」是**误判**：只核对了 URL 里的坐标与参数，没有真正打开落地页。

实际打开线上链接后，百度会 302 到 `https://map.baidu.com/@13393908,3535082,13z` —— 一个与路线无关的普通地图首页（并定位到浏览器所在城市），**不进入路线页，且不报错**。

参数隔离实验（同一对坐标、同一时段）：

| 变体 | 落地页标题 | 结论 |
|---|---|---|
| 线上原样 | `百度地图`（`map.baidu.com/@...`） | ❌ 静默跳首页 |
| 补 `region=西安` | `玄奘法师铜像至唐城墙遗址公园 - 百度地图` | ✅ |
| `region=233`（城市 ID） | 同上 | ✅ |
| `src` 改三段式 | `百度地图` | ❌ 无效 |
| 无 `output=html` | `页面不存在_百度搜索` | ❌ |

结论：`region` 是唯一缺失的必需参数，`src` 写法和 `origin` 内 `latlng|name` 顺序都不影响。

修复与发布：

- `dist/navigation.mjs` 的 `navigationUrl` 增加 `region` 参数；`dist/maps.js` 的 `routeLeg` 透传、`planTrip` 从地点数据取 `p.region`（JSAPI `LocalSearch` 返回的 POI 不含行政区，必须自己透传）。
- 单测由 15 个增至 16 个，全部通过；`node --check` 全过。
- 提交 `f7fdce3` → `git push` → `git subtree push`：`809d60c..e1c8d28`，快进，未强推。Pages 构建 40.5 秒，`built`。
- 线上端到端复验：行程页生成的链接已带 `region=西安市`，点击后落地页标题为「玄奘法师铜像至唐城墙遗址公园 - 百度地图」，显示步行 tab 与「2小时3分钟约8.1公里」及完整分段文字指引。通过。

截图证据：`/tmp/xiyou-nav-landing.png`（修复前，跳地图首页）、`/tmp/xiyou-nav-region.png`、`/tmp/xiyou-nav-fixed-live.png`（修复后）。

## 状态持久化线上复验（2026-09-20 21:13 CST，版本 `e1c8d28`）

真实浏览器会话，逐项读写 `localStorage` 键 `xiyou-xingji-v1` 并与界面比对：

| 项 | 结果 |
|---|---|
| 标记读过 | ✅ 写入 `read.changan = true`，新页面加载后仍为 true，界面显示「已读」 |
| 保存心得 | ✅ 写入 `notes.changan`，新页面加载后仍存在，文牒视图回填正确 |
| 已确认 POI | ✅ `confirmedPlaces` 含 `xuanzang`、`yanping`，均带 `bd09ll` 坐标；**刷新后行程页不再要求重新确认** |
| 行程与偏好 | ✅ `trip`、`mode`、`budgetMinutes` 均保留 |
| 状态版本 | ✅ `version: 2` |
| 来源深链接 | ✅ `#story=changan&view=journal` 直接进入文牒视图 |

**PRD 1.5 所列「重载行程：已选 POI 丢失」这一已知断点，本轮复验确认已修复。**

## 仍在线的缺陷：到访记录未去重（2026-09-20 21:13 CST 发现）

同一地点、同一方式、同一天连续手动记录两次，`visits` 数组长度为 2，文牒页并排显示两条「玄奘广场 · 手动记录 · 2026/9/20」。

- PRD 1.5 把到访的「保存、去重、恢复及定位」一并列为待验收项，**去重未生效**。
- 附带发现：PRD 第五章目标契约把 `visits` 定义为「唯一记录 ID 映射 placeId、method、date」的对象；当前实现是数组 `[{id: placeId, method, date}]`，元素内的 `id` 实为地点 ID。此为契约与实现的偏离，需要决定改代码还是改契约。

测试产生的临时心得与到访已清理，未残留在文牒中（`notes`、`visits` 均已复位为空）。

## 仍未验证

- 备份导出/导入往返：线上未跑完整往返（导出会触发浏览器下载，未在本轮捕获文件）。
- 定位辅助真实浏览器权限、精度不足和 200 米判断：未用真实地理位置测试；P0 可用手动到访覆盖。
- 四视口（390/430/768/1440）线上响应式：本轮未逐视口重跑。
- 超预算精简建议的「必去保护」与「输入变化使旧建议失效」：未复现测试，PRD 1.5 亦将其列为待复现项。
- 第十章性能指标（LCP、点击反馈、搜索/路线耗时、布局溢出）：未测量。

## 剩余阻塞

- ~~Referer 白名单未写入~~ 已于 2026-09-20 20:46 由用户写入 `*.mamamiyanadesu.github.io*`，并经差分实验证明生效。
- 部署域名已确认为 `mamamiyanadesu.github.io`（2026-09-20 用户确认），`DEPLOY.md` 占位已替换完毕。
- 旧浏览器端 AK 已弃用，应从百度控制台删除或停用，避免遗留可用凭据。
- 到访去重未实现，且 `visits` 结构与 PRD 契约不一致，待决策。

## 下一步

1. 决定 `visits` 是补去重逻辑还是修订 PRD 契约。
2. 线上跑一次备份导出/导入往返，以及超预算建议的必去保护复现。
3. 四视口线上响应式逐项重跑。
4. 如需把后续改动再次上线，继续用 `git subtree push --prefix dist origin gh-pages`，不要强推。

