# 无限梦境 · 临时 AI 接入配置

> 用途：当前阶段用于小说/剧情生成  
> 状态：临时配置，后续如更换供应商或模型再调整

---

## 一、当前确认配置

- 协议：`Anthropic Messages API`
- Base URL：`https://claude.aiapis.help`
- Model：`claude-sonnet-4-6`
- API Key：`sk-OvISE4fdCub1wT4zJ0JjJe2fBuxwygEuxVSWBaP5QhLSIXcI`

---

## 二、用途约定

- 当前阶段，所有“小说生成 / 剧情生成 / 章节叙事生成”统一使用上述地址和模型
- 后续如果接入别的模型，优先只替换配置，不改业务接口层

---

## 三、已验证结果

已完成最小连通性测试：

- `GET /v1/models` 成功
- `POST /v1/messages` 成功
- 使用模型 `claude-sonnet-4-6` 返回正常文本结果

---

## 四、接口示例

### 1. 获取模型列表

```bash
curl https://claude.aiapis.help/v1/models \
  -H "x-api-key: sk-OvISE4fdCub1wT4zJ0JjJe2fBuxwygEuxVSWBaP5QhLSIXcI" \
  -H "anthropic-version: 2023-06-01"
```

### 2. 最小消息请求

```bash
curl https://claude.aiapis.help/v1/messages \
  -H "x-api-key: sk-OvISE4fdCub1wT4zJ0JjJe2fBuxwygEuxVSWBaP5QhLSIXcI" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 128,
    "messages": [
      {
        "role": "user",
        "content": "请生成一段 100 字以内的古风悬疑开场。"
      }
    ]
  }'
```

---

## 五、项目接入建议

后续项目代码中建议统一抽象为以下配置项：

```env
ANTHROPIC_BASE_URL=https://claude.aiapis.help
ANTHROPIC_API_KEY=sk-OvISE4fdCub1wT4zJ0JjJe2fBuxwygEuxVSWBaP5QhLSIXcI
ANTHROPIC_MODEL=claude-sonnet-4-6
```

建议封装一个统一的 `story-ai-client`，业务层只传入：

- system prompt
- messages
- max_tokens
- temperature

不要在剧情服务里直接散落多个 HTTP 请求实现。

---

## 六、阶段性结论

当前可以默认采用以下技术决策：

- 剧情生成模型：`claude-sonnet-4-6`
- 接入协议：`Anthropic`
- 中转地址：`https://claude.aiapis.help`
- 使用范围：MVP 期间的剧情文本生成

如后续要开始写代码，前后端接口层都按这个配置对接即可。
