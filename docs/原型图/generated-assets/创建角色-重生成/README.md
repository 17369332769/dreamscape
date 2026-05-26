# 创建角色重生成素材

来源参考图：`/Users/czy/Documents/dreamscape/docs/原型图/创建角色.png`

这批文件不是从原型图直接裁切出来的，而是参考原型的美术方向重新生成后，再做透明化整理得到的素材。

可直接用于前端：

- `hero-character.png`：主角色立绘，透明背景
- `preview-avatar.png`：从重生成立绘整理出的头像版，透明背景
- `title-logo.png`：顶部“创建角色”标题字，透明背景
- `hero-top-background.png`：顶部整体氛围背景
- `currency-crystal.png`：货币晶石图标，透明背景
- `cta-button.png`：底部主按钮底板，不含文字，透明背景
- `panel-frame-basic-info.png`：基本信息大框体底板
- `panel-frame-section.png`：通用内容框体底板
- `panel-frame-summary.png`：预览确认框体底板
- `stepper-strip.png`：顶部 1-4 步骤条整图
- `step-node-active-blank.png`：可拼装的高亮步骤圆点，不带数字
- `step-node-inactive-blank.png`：可拼装的普通步骤圆点，不带数字
- `step-connector-dots.png`：可拼装的步骤连接虚线
- `step-node-1-active.png`：带数字的高亮步骤圆点
- `step-node-2.png`
- `step-node-3.png`
- `step-node-4.png`
- `section-badge-1.png`
- `section-badge-2.png`
- `section-badge-3.png`
- `section-badge-4.png`
- `stat-icon-wuli.png`
- `stat-icon-zhimou.png`
- `stat-icon-meili.png`
- `stat-icon-qiyun.png`
- `stat-icon-yizhi.png`

辅助文件：

- `stat-icons-sheet.png`：五个属性图标的组合大图
- `section-badges-sheet.png`：四个章节编号徽记组合图
- `stepper-parts-sheet.png`：步骤条可拼装小件组合图
- `_staging/`：保留的原始生成图和中间处理文件

建议：

- 返回按钮、输入框、滑杆、按钮文案、步骤标题文字这类规则 UI 仍然更适合直接在代码里重建。
- `title-logo.png` 和 `cta-button.png` 带有较柔和的外发光，更适合放在深色背景上使用。
