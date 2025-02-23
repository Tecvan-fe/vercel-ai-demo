# 基于 vercel ai sdk 的 RAG 应用

## 功能

提供两类命令：

- `rag add` 添加文档到向量数据库，支持 `-f/--file` 指定文件路径，支持 `-d/--dir` 指定目录路径

  - 读取文件/目录内容
  - 对文档进行分块(chunking)
  - 使用 OpenAI 生成文本向量嵌入
  - 将原始文档和向量存入数据库

- `rag start` 启动 llm 服务，服务中根据向量数据库中的内容，提供基于文本的问答服务
  - 启动 HTTP 服务
  - 接收用户问题
  - 将问题转换为向量
  - 在向量数据库中检索相似内容
  - 将相关内容作为上下文传给 LLM
  - 返回 LLM 回答

## 技术栈

- vercel ai sdk
- postgres
- drizzle
- nanoid
- commander
