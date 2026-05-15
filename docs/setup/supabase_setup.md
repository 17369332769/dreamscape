# 无限梦境 · Supabase 准备清单

> 目标：为当前项目准备 `Supabase / PostgreSQL` 数据库接入

---

## 一、当前结论

当前开发阶段，数据库先统一使用 `Supabase PostgreSQL`。

原因：

- 上手快，适合 MVP
- 数据模型仍然按标准 `PostgreSQL` 设计
- 后续如果要迁移到别的 PostgreSQL 托管环境，成本相对可控

---

## 二、你现在需要准备的东西

控制台地址：

- [Supabase Dashboard](https://supabase.com/dashboard)

建议按这个顺序操作：

1. 创建一个新 project
2. 记录数据库密码
3. 进入项目设置
4. 打开 `Project Settings`
5. 找到 `Database`
6. 复制连接信息

---

## 三、项目里需要的连接信息

你拿到连接信息后，填进下面两个环境变量：

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/postgres
DIRECT_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/postgres
```

当前项目里已经预留了这两个变量：

- [.env.example](/Users/czy/Documents/dreamscape/.env.example)

说明：

- `DATABASE_URL`：应用运行时连接数据库
- `DIRECT_URL`：后续给 Prisma 迁移或直连操作使用

早期开发阶段，这两个值可以先填成一样。

---

## 四、推荐你现在这样准备

### 方案 A：最快启动

- 新建一个 Supabase project
- 复制 connection string
- 直接填到 `DATABASE_URL` 和 `DIRECT_URL`

### 方案 B：更规范

- 新建 project
- 单独保存数据库密码
- 复制 pooled connection string
- 再复制 direct connection string
- 分别填入 `DATABASE_URL` 和 `DIRECT_URL`

---

## 五、注意事项

- 如果密码里有特殊字符，写入连接串前要做 URL 编码
- 如果后面接 Prisma，迁移通常更适合走 `DIRECT_URL`
- 运行时普通查询可以优先走池化连接

---

## 六、准备完成的标志

当你把下面任一项给我时，我就可以继续接数据库代码：

1. `DATABASE_URL`
2. 如果和上面不同，再给 `DIRECT_URL`

如果你不想直接发完整连接串，也可以只发：

- host
- port
- database
- username

密码你本地自己填也可以。

---

## 七、我这边下一步会做什么

只要 Supabase 连接信息到位，我下一步就会直接继续：

1. 接入 Prisma
2. 建立 `users / characters / saves / messages` 四张核心表
3. 跑第一版数据库迁移
4. 把 `创建角色` 和 `开始章节` 接口接上数据库
