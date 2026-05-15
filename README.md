# 无限梦境

MVP 开发工作区。

## 结构

- `apps/server`: Next.js API 服务
- `apps/miniprogram`: Taro + React 小程序前端
- `packages/shared`: 共享类型、常量与 schema
- `packages/api-client`: 预留前后端共享请求封装
- `docs`: 项目文档

## 启动思路

先跑通后端剧情接口，再接小程序页面。

## 当前技术决策

- AI 剧情模型：`claude-sonnet-4-6`
- 数据库：`Supabase PostgreSQL`
- 后端主逻辑：`Next.js API`

## 环境变量

- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `DATABASE_URL`
- `DIRECT_URL`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Supabase 连接串格式

- `DATABASE_URL`：优先使用 Session Pooler，形如 `postgresql://postgres.<project-ref>:<password>@aws-<region>.pooler.supabase.com:5432/postgres`
- `DIRECT_URL`：直连数据库时使用 `postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres`

如果本机开启了会接管 DNS 的代理（例如 fake-IP 模式），`*.supabase.co` 或 `*.pooler.supabase.com` 可能会被解析到 `198.18.0.0/15` 这类保留地址，导致 `pg` 在 5432/6543 端口握手阶段被中断。遇到这种情况，优先给这些域名加直连规则，或切到不拦截数据库端口的网络。

## Supabase 接入

服务端现在同时预留了两条链路：

- `@supabase/supabase-js`：适合走 Supabase API、Auth、Storage
- `pg`：适合直接执行 PostgreSQL 查询

健康检查接口：

- `GET /api/health`

返回里会分别展示：

- Supabase 公共 API 探测
- Supabase 管理 API 探测
- `DATABASE_URL` 运行时连接探测
- `DIRECT_URL` 直连探测

## 推荐分层

- `apps/server/app/api`: 只放路由入口
- `apps/server/src/integrations`: AI、Supabase、Postgres 等外部集成
- `apps/server/src/modules`: 角色、剧情、存档等业务模块
- `apps/miniprogram/src/pages`: 小程序页面
- `apps/miniprogram/src/components`: 小程序复用组件
- `packages/shared`: 前后端共享结构
