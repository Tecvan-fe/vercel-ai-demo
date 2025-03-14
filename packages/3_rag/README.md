# RAG CLI 工具

基于 Vercel AI SDK 实现的检索增强生成(RAG)命令行工具。该工具可以将文档添加到向量数据库中，并提供基于文档内容的智能问答服务。

## 功能特点

- 支持添加单个文件或整个目录到知识库
- 自动进行文档分块和向量化处理
- 基于语义相似度的智能检索
- 交互式命令行问答界面
- 实时流式响应
- 优雅的加载动画

## 安装

```bash
# 安装依赖
pnpm install
```

## 数据库设置

确保已安装 [PostgreSQL](https://www.postgresql.org)，之后创建数据库：

```bash
pnpm db:migrate
```

## 使用方法

### 添加文档

```bash
# 添加单个文件
OPENAI_API_KEY=xxx DATABASE_URL=xxx npx tsx src/index.ts add -f path/to/file.txt

# 添加整个目录
OPENAI_API_KEY=xxx DATABASE_URL=xxx npx tsx src/index.ts add -d path/to/directory
```

### 启动问答服务

```bash
OPENAI_API_KEY=xxx DATABASE_URL=xxx npx tsx src/index.ts start
```

使用 `exit` 命令退出问答服务。

## 技术栈

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI 功能支持
- [OpenAI](https://openai.com) - GPT-4 和文本嵌入
- [PostgreSQL](https://www.postgresql.org) + [pgvector](https://github.com/pgvector/pgvector) - 向量数据库
- [Drizzle ORM](https://orm.drizzle.team) - 数据库 ORM
- [Commander.js](https://github.com/tj/commander.js) - 命令行工具
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - 交互式命令行
- [Ora](https://github.com/sindresorhus/ora) - 终端加载动画
