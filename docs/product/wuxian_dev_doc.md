# 无限梦境 · 首发开发文档

> AI 驱动的角色扮演互动小说游戏  
> 版本：v0.1 · 开发初稿  
> 对应产品文档：`wuxian_doc_link.md` v1.3

---

## 一、开发目标

### 首发核心目标

在首发阶段一次性完成完整体验，验证玩家是否愿意持续体验 AI 互动剧情，并为完整章节、世界观、社区与角色成长体系持续付费和留存。

### 首发范围

```text
古风仙侠 + 多世界观
微信小程序优先
选项式互动 + 自由输入
完整角色创建流程
完整章节体系
完整属性检定
完整背包
章节结算
真实梦境石消耗
内容审核兜底
社区广场
真实支付
实时图片生成
```

### 首发必须包含

- 多世界观
- 创作者工具
- 社区广场
- 自由输入
- 复杂商店
- 赛季排行榜
- 真实支付

---

## 二、技术架构

### 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 小程序前端 | Taro + React + TypeScript | 微信小程序优先，后续兼容 QQ/抖音 |
| 后端 | Next.js API Routes | BFF + 业务逻辑 |
| 数据库 | MemFire Cloud / PostgreSQL | 用户、角色、存档、消息、道具 |
| AI 生成 | Claude API | 剧情叙事与选项生成 |
| 内容审核 | 第三方审核 API + 本地规则 | 输入、输出、分享内容审核 |
| 对象存储 | MemFire Storage | 角色头像、场景图、分享卡 |

### 服务关系

```text
Taro 小程序
  ↓
Next.js API
  ├── Auth Service
  ├── Character Service
  ├── Story Engine
  ├── Inventory Service
  ├── Moderation Service
  ├── Economy Service
  └── Analytics Service
  ↓
PostgreSQL / Storage / AI API / Audit API
```

---

## 三、核心业务流程

### 新用户流程

```text
进入小程序
 ↓
微信登录
 ↓
创建角色
 ↓
选择古风仙侠世界
 ↓
进入序章
 ↓
完成第一章
 ↓
章节结算
 ↓
点击进入第二章
 ↓
触发梦境石消耗提示
```

### 剧情回合流程

```text
用户选择选项
 ↓
后端校验存档状态
 ↓
检查选项是否需要道具/属性/章节阶段
 ↓
如需检定，后端计算检定结果
 ↓
组装 Prompt
 ↓
调用 AI 生成结构化剧情
 ↓
校验 JSON Schema
 ↓
内容审核
 ↓
写入 messages / saves / inventory / npc_relations
 ↓
返回前端展示
```

### 章节结束流程

```text
回合数达到 ending 阶段
 ↓
后端统计关键选择、检定结果、NPC 好感、持有道具
 ↓
匹配结局条件
 ↓
调用 AI 生成结局叙事
 ↓
内容审核
 ↓
发放奖励
 ↓
写入章节结算数据
 ↓
返回结算页
```

---

## 四、剧情状态机

### 章节阶段

| 阶段 | 回合范围 | 作用 | 允许事件 |
|------|---------|------|---------|
| intro | 1-3 | 开场、场景建立、NPC 登场 | 普通选择、轻量线索 |
| trigger | 4-6 | 第一个冲突、第一处关键选择 | 关键选择、首次检定 |
| develop | 7-14 | 推进调查、关系变化、道具获得 | 检定、道具、好感变化 |
| climax | 15-20 | 最大冲突、强检定、核心选择 | 高难检定、关键选择、隐藏选项 |
| ending | 21+ | 结局收束、奖励发放 | 结局判定、奖励、钩子 |

### 阶段流转规则

```text
intro → trigger：round >= 4
trigger → develop：round >= 7 或完成 trigger_key_choice
develop → climax：round >= 15 或完成 2 个关键选择
climax → ending：round >= 20 或完成 climax_key_choice
ending → chapter_end：匹配结局条件
```

### 存档状态

| 状态 | 含义 | 处理方式 |
|------|------|---------|
| normal | 正常推进 | 允许选择普通选项 |
| injured | 受伤 | 武力检定 -3，持续到章节结束或使用道具 |
| confused | 心乱 | 智谋检定 -2，持续 1 回合 |
| locked | 正在生成或结算 | 禁止重复提交 |
| chapter_end | 章节已结束 | 只能进入结算页或下一章 |

---

## 五、AI 输出 JSON Schema

### 剧情回合响应

AI 必须返回纯 JSON，不允许在 JSON 外输出解释文本。

```json
{
  "narrative": "夜风卷过青石板路，你悄然潜入府邸侧门。",
  "options": [
    {
      "id": "A",
      "text": "顺着秘道深入",
      "requirements": null
    },
    {
      "id": "B",
      "text": "先观察四周动静",
      "requirements": null
    },
    {
      "id": "C",
      "text": "出示玄铁令打开暗门",
      "requirements": {
        "type": "item",
        "item_id": "xuan_tie_ling"
      }
    }
  ],
  "scene_tag": "night_mansion",
  "mood": "tense",
  "check": {
    "required": true,
    "type": "int",
    "threshold": 6,
    "reason": "判断府中巡逻规律"
  },
  "npc_affection_changes": [
    {
      "npc_id": "lao_chen",
      "delta": 3,
      "reason": "玩家遵守承诺，没有牵连老陈"
    }
  ],
  "inventory_changes": [
    {
      "action": "add",
      "item_id": "secret_map_piece",
      "quantity": 1,
      "reason": "在暗格中发现残图"
    }
  ],
  "key_choice": {
    "id": "help_lao_chen",
    "value": true
  },
  "special_event": null
}
```

### 字段规则

| 字段 | 必填 | 规则 |
|------|------|------|
| narrative | 是 | 80-220 字，不能包含 Markdown |
| options | 是 | 固定 3 个选项，id 只能是 A/B/C |
| scene_tag | 是 | 使用英文 snake_case |
| mood | 是 | calm/tense/sad/epic/mystery/danger |
| check | 是 | 无检定时为 null |
| npc_affection_changes | 是 | 无变化时为空数组 |
| inventory_changes | 是 | 无变化时为空数组 |
| key_choice | 是 | 无关键选择时为 null |
| special_event | 是 | 无特殊事件时为 null |

### 解析失败处理

```text
第一次失败：用同一上下文要求模型只修复 JSON
第二次失败：使用安全兜底剧情
第三次失败：记录错误，返回“稍后重试”并解锁存档状态
```

---

## 六、第一章剧情骨架

### 第一章：落霞镇疑云

| 项 | 内容 |
|----|------|
| 世界观 | 古风仙侠 |
| 章节目标 | 调查镇守使失踪案 |
| 核心 NPC | 铁匠老陈、师父剑无痕、黑风寨探子 |
| 关键道具 | 玄铁令、残破地图、醒神香 |
| 主要冲突 | 黑风寨暗中控制落霞镇，镇守使掌握魔道线索后失踪 |

### 关键节点

| 回合 | 阶段 | 节点 | 影响 |
|------|------|------|------|
| 1 | intro | 抵达落霞镇 | 建立场景 |
| 3 | intro | 老陈暗示镇中异常 | 引出调查 |
| 5 | trigger | 黑衣人夜袭铁匠铺 | 第一次关键选择 |
| 8 | develop | 发现镇守府密道 | 可用玄铁令 |
| 11 | develop | 师父来信提醒不要轻信任何人 | 影响 NPC 判断 |
| 15 | climax | 黑风寨探子现身 | 高难检定 |
| 18 | climax | 选择救老陈或追探子 | 影响结局 |
| 21 | ending | 揭示镇守使下落 | 进入结局 |

### 结局条件

| 结局 | 条件 | 结果 |
|------|------|------|
| A 真相初明 | 获得残破地图且救下老陈 | 解锁第二章隐藏线索 |
| B 错失线索 | 未获得地图但老陈存活 | 第二章开场难度提高 |
| C 孤身追敌 | 放弃老陈并追上探子 | 获得黑风寨情报，老陈好感下降 |
| D 落难脱身 | 关键检定连续失败 | 进入受伤状态，但剧情继续 |

---

## 七、API 设计

### 认证

```http
POST /api/auth/login
```

请求：

```json
{
  "platform": "wechat",
  "code": "wx_login_code"
}
```

响应：

```json
{
  "user_id": "uuid",
  "token": "jwt",
  "is_new_user": true
}
```

### 创建角色

```http
POST /api/characters
```

请求：

```json
{
  "name": "云无涯",
  "gender": "male",
  "bio": "自幼在山中长大，偶得残卷。",
  "attributes": {
    "str": 2,
    "int": 3,
    "cha": 2,
    "lck": 1,
    "wil": 2
  },
  "traits": {
    "personality": ["谨慎多疑"],
    "ability": "过目不忘",
    "fate": "破而后立"
  }
}
```

### 开始章节

```http
POST /api/story/start
```

请求：

```json
{
  "character_id": "uuid",
  "world_id": "xianxia",
  "chapter": 1
}
```

### 提交选项

```http
POST /api/story/choice
```

请求：

```json
{
  "save_id": "uuid",
  "round": 7,
  "option_id": "B"
}
```

响应：

```json
{
  "save_id": "uuid",
  "round": 8,
  "chapter_phase": "develop",
  "narrative": "你没有立刻推门，而是伏在窗下听了片刻。",
  "options": [
    {"id": "A", "text": "破门而入"},
    {"id": "B", "text": "继续观察"},
    {"id": "C", "text": "返回找老陈"}
  ],
  "check_result": {
    "type": "int",
    "value": 6,
    "threshold": 5,
    "success": true
  },
  "inventory_changes": [],
  "npc_affection_changes": [],
  "is_chapter_end": false
}
```

### 使用道具

```http
POST /api/inventory/use
```

请求：

```json
{
  "save_id": "uuid",
  "inventory_id": "uuid",
  "target": {
    "type": "attribute_check",
    "attribute": "int"
  }
}
```

---

## 八、数据库补充约束

### 关键索引

```sql
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_saves_user_id ON saves(user_id);
CREATE INDEX idx_saves_character_id ON saves(character_id);
CREATE INDEX idx_messages_save_round ON messages(save_id, round);
CREATE INDEX idx_inventories_character_id ON inventories(character_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

### 幂等字段

| 表 | 字段 | 用途 |
|----|------|------|
| messages | request_id | 防止回合重复提交 |
| transactions | idempotency_key | 防止重复扣费 |
| inventories | source_event_id | 防止重复发奖 |

---

## 九、经济账本

### 梦境石类型

| 类型 | 来源 | 用途 |
|------|------|------|
| paid | 真实充值 | 章节、皮肤、存档位 |
| bonus | 系统赠送、任务奖励 | 章节、普通消耗 |
| test | 内测测试额度 | 首发测试与风控验证 |

### 扣费优先级

```text
test → bonus → paid
```

### 交易记录要求

每次梦境石变化都必须写入 `transactions`，包括赠送、消耗、退款、系统调整。

```json
{
  "type": "chapter_unlock",
  "amount": -10,
  "currency": "dream_stone_test",
  "description": "解锁第二章：风起黑风寨",
  "idempotency_key": "unlock_chapter_2_save_uuid"
}
```

---

## 十、埋点事件

### 核心事件表

| 事件名 | 触发时机 | 关键属性 |
|--------|---------|---------|
| app_open | 打开小程序 | user_id, platform |
| login_success | 登录成功 | is_new_user |
| character_create_start | 进入角色创建 | world_id |
| character_create_success | 创建角色成功 | attributes, traits |
| chapter_start | 开始章节 | chapter, save_id |
| story_choice_submit | 提交选项 | round, option_id, chapter_phase |
| story_response_success | AI 回复成功 | latency_ms, token_count, audit_result |
| story_response_failed | AI 回复失败 | error_type, retry_count |
| attribute_check_result | 属性检定完成 | type, value, threshold, success |
| item_use | 使用道具 | item_id, scene_tag |
| item_gain | 获得道具 | item_id, source |
| npc_affection_change | NPC 好感变化 | npc_id, delta |
| chapter_complete | 完成章节 | chapter, ending_type, round_count |
| chapter_replay | 重玩章节 | chapter |
| unlock_prompt_show | 展示解锁提示 | chapter, cost |
| unlock_prompt_click | 点击解锁 | chapter, balance |
| dream_stone_spend | 消耗梦境石 | amount, reason |
| moderation_block | 内容审核拦截 | content_type, rule |

### 首发关键漏斗

```text
app_open
 ↓
login_success
 ↓
character_create_success
 ↓
chapter_start
 ↓
chapter_complete
 ↓
unlock_prompt_show
 ↓
unlock_prompt_click
```

---

## 十一、管理后台

### 首发后台功能

| 模块 | 功能 |
|------|------|
| 用户管理 | 查看用户、角色、梦境石余额 |
| 存档查看 | 查看章节进度、关键选择、结局 |
| AI 日志 | 查看 Prompt、模型输出、解析结果、耗时 |
| 审核日志 | 查看输入输出审核结果、命中规则 |
| 内容配置 | 管理章节骨架、NPC、道具、结局条件 |
| 道具配置 | 创建和编辑道具定义 |
| 成本统计 | 按用户、章节、模型统计 token 和费用 |

### 后台权限

| 角色 | 权限 |
|------|------|
| admin | 全部权限 |
| operator | 内容配置、审核、日志查看 |
| support | 用户查询、存档查询 |
| readonly | 只读查看 |

---

## 十二、测试计划

### 功能测试

- 登录成功和失败
- 角色创建属性点校验
- 特质选择上限校验
- 章节开始和继续
- 选项提交
- 属性检定成功/失败
- 道具获得和使用
- 章节结局判定
- 梦境石模拟扣除

### AI 稳定性测试

- JSON Schema 合法率
- 解析失败重试
- 模型超时
- 内容重复
- 设定漂移
- NPC 记忆一致性
- 章节阶段越界

### 审核测试

- 角色名违规
- 背景描述违规
- AI 输出违规
- 图片 Prompt 违规
- 分享卡违规
- 审核 API 超时
- 审核误杀后的兜底剧情

### 兼容与性能测试

- 微信开发者工具
- iOS 微信
- Android 微信
- 弱网
- 重复点击提交
- 后台切回前台
- 流程中断后恢复

---

## 十三、验收标准

### 产品验收

- 用户可以完成从登录、建角、第一章游玩到结算的完整闭环。
- 第一章至少包含 15 个有效回合。
- 至少存在 3 种可触发结局。
- 至少存在 2 个属性检定点。
- 至少存在 2 个道具获得点和 1 个道具使用点。
- 第二章入口可以展示模拟梦境石消耗提示。

### 工程验收

- 所有核心 API 有错误处理。
- 回合提交具备幂等保护。
- AI 输出解析失败时不会卡死存档。
- 审核失败时有安全兜底内容。
- 核心事件埋点可以正常上报。
- AI 调用成本可以按章节统计。

### 数据验收

- 用户、角色、存档、消息、道具、交易记录可追溯。
- 章节结局可由关键选择和状态复现。
- 道具发放和扣除不会重复。
- 梦境石变化有完整账本。

---

## 十四、待确认事项

- 具体 AI 模型和调用供应商
- 内容审核 API 供应商
- 微信小程序主体和认证状态
- MemFire Cloud 项目环境
- 第一章完整文案风格
- 后台是否使用现成 admin 框架
- 内测规模和测试用户来源
