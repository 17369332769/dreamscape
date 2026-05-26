# 故事页重生成素材

来源参考图：`/Users/czy/Documents/dreamscape/docs/原型图/故事.png`

这批新增文件不是从故事页原型直接截位置得到的，而是参考原图的角色、美术氛围和道具特征重新生成，再做透明化整理后的可用素材。

可直接用于前端：

- `story-hero-character.png`：故事页主角立绘，透明背景
- `story-scene-background.png`：月夜古城场景背景，不含 UI、不含角色
- `story-npc-elder.png`：老者 NPC 头像素材，透明背景
- `story-item-xuantie-token.png`：玄铁令道具图标，透明背景

目录中原有的其他文件：

- `story-panel-main.png`、`story-text-panel.png`、`story-bottom-nav.png` 等更偏向界面底板或组合件
- `story-choice-*.png`、`story-utility-button-*.png` 等更适合临时还原原型样式
- `stat-icon-*.png`、`currency-crystal.png` 这类小图标可继续直接复用

辅助文件：

- `_staging/story-hero-character-source.png`
- `_staging/story-npc-elder-source.png`
- `_staging/story-item-xuantie-token-source.png`

说明：

- 这次重点补的是“可单独复用的美术主体”，不是位置截图。
- 像属性条、章节标题字、奖励浮层、选项框、输入框、底部导航这类规则 UI，仍然更建议在代码里重建。
