# 故事页重生成素材

来源参考图：`/Users/czy/Documents/dreamscape/docs/原型图/故事.png`

这套目录当前同时包含两类素材：

- 一类是参考原图氛围后重新生成、再做透明化整理的主体素材
- 一类是从故事页原型图中直接裁出的内容件，用于快速还原具体 UI 视觉

可直接用于前端：

- `story-hero-character.png`：故事页主角立绘，透明背景
- `story-scene-background.png`：月夜古城场景背景，不含 UI、不含角色
- `story-npc-elder.png`：老者 NPC 头像素材，透明背景
- `story-item-xuantie-token.png`：玄铁令道具图标，透明背景

目录中原有的其他文件：

- `story-panel-main.png`、`story-text-panel.png`、`story-bottom-nav.png` 等更偏向界面底板或组合件
- `story-choice-*.png`、`story-utility-button-*.png` 等更适合临时还原原型样式
- `stat-icon-*.png`、`currency-crystal.png` 这类小图标可继续直接复用

本次补充的“清理后可直接复用的内容件”：

- `story-utility-button-settings-filled.png`：右侧“设置”按钮，透明底清理版，保留图标和文字
- `story-utility-button-map-filled.png`：右侧“地图”按钮，透明底清理版，保留图标和文字
- `story-button-recap-filled.png`：左下“剧情回顾”按钮，透明底清理版
- `story-inspiration-tip.png`：左下“灵感提示”图标与标题，已去除整块背景
- `story-send-button-filled.png`：输入栏右侧发送按钮，独立按钮版
- `story-bottom-nav-filled.png`：底部整块导航栏，作为一整块可复用素材输出

这些新增文件与原有的空底板类素材不同：

- `*-filled.png` 更适合直接贴图还原原型
- 原有 `story-bottom-nav.png`、`story-utility-button-*.png`、`story-button-recap.png` 仍然可以继续作为“无文案底板”复用

辅助文件：

- `_staging/story-hero-character-source.png`
- `_staging/story-npc-elder-source.png`
- `_staging/story-item-xuantie-token-source.png`
- `_staging/story-utility-button-settings-filled-source.png`
- `_staging/story-utility-button-map-filled-source.png`
- `_staging/story-button-recap-filled-source.png`
- `_staging/story-inspiration-tip-source.png`
- `_staging/story-send-button-filled-source.png`
- `_staging/story-bottom-nav-filled-source.png`

说明：

- 这次重点补的是“可单独复用的美术主体”，不是位置截图。
- 像属性条、章节标题字、奖励浮层、选项框、输入框、底部导航这类规则 UI，仍然更建议在代码里重建。
- 这次新增的 `*-filled.png` 属于清理后的透明内容件，不是简单矩形截图，适合需要快速还原视觉时直接使用。
