# @tecvan-fe/mdc-mcp

> WIP

一个用于 Coze Design 组件库的 Model Context Protocol (MCP) 服务，让 AI 能够理解和操作组件文档。

## 功能特点

- 🚀 提供 MCP 服务器，支持 AI 模型与组件文档的交互
- 📚 支持组件文档的查询和检索
- 🔍 支持获取组件详细信息和属性列表
- 📝 支持获取组件示例代码
- 🖥️ 支持 HTTP 服务模式和命令行交互模式

## Cursor

- 使用 `command` 方式

```json
{
  "mcpServers": {
    "mdc-mcp": {
      "type": "command",
      "command": "npx",
      "args": ["@tecvan-fe/mdc-mcp@alpha", "start"]
    }
  }
}
```

- 使用 `http` 方式：

```sh
pnpm dlx @tecvan-fe/mdc-mcp@alpha serve

```

之后修改 cursor 配置

```json
{
  "mcpServers": {
    "mdc-mcp-server": {
      "type": "http",
      "url": "http://localhost:3000/sse"
    }
  }
}
```

之后在 prompt 中带上 `/cd` 关键字，就会触发 mcp 接口。
