# 自由布局流程图编辑器组件

一个基本的自由布局流程图编辑器，支持拖放操作、小地图和自动对齐功能。

## 技术栈

该组件基于以下技术栈：

- React 18+
- TypeScript
- @flowgram.ai/free-layout-editor
- @flowgram.ai/free-snap-plugin
- @flowgram.ai/minimap-plugin

## 功能特点

- 自由布局：支持节点自由拖拽和定位
- 连接管理：节点之间可创建连接关系
- 缩放控制：支持画布缩放和视图适配
- 小地图导航：提供全局视图导航功能
- 自动对齐：拖拽节点时提供对齐参考线
- 历史管理：支持撤销和重做操作
- 节点编辑：支持编辑节点内容

## 文件结构

```
src/
  ├── app.tsx                # 应用入口点
  ├── editor.tsx             # 主编辑器组件
  ├── index.css              # 样式定义
  ├── initial-data.ts        # 初始流程图数据
  ├── node-registries.ts     # 节点注册表定义
  ├── components/
  │   ├── minimap.tsx        # 小地图组件
  │   ├── node-add-panel.tsx # 节点添加面板
  │   └── tools.tsx          # 工具栏组件
  └── hooks/
      └── use-editor-props.tsx # 编辑器属性配置
```

## 开始使用

1. 安装依赖

```bash
npm install
```

2. 运行开发服务器

```bash
npm run dev
```

3. 构建生产版本

```bash
npm run build
```

## 自定义扩展

1. 添加更多类型的节点：修改 `node-registries.ts`
2. 自定义节点渲染：修改 `use-editor-props.tsx` 中的 `getNodeDefaultRegistry` 函数
3. 添加数据持久化逻辑：在 `onContentChange` 回调中实现
4. 扩展编辑器功能：添加更多插件

## 使用示例

### 添加新节点

从左侧面板拖拽节点类型到画布中即可创建新节点。

### 连接节点

点击一个节点的输出端口，然后拖拽到另一个节点的输入端口。

### 编辑节点内容

点击节点内容区域进行编辑。

### 使用工具栏

工具栏提供了缩放、视图适配、自动布局、撤销和重做功能。
