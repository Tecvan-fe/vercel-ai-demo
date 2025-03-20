# Ant Design 与 Tailwind CSS 集成示例

一个基于 Rspack、Ant Design、Tailwind CSS 和 React Router 构建的 React 应用程序示例，采用纯 Tailwind 样式和完整的路由系统。

## 功能特点

- 使用 Rspack 作为构建工具，提供快速的开发体验
- 集成 Ant Design 组件库，提供美观的用户界面
- 完全使用 Tailwind CSS 实用工具类实现所有样式
- 使用 React Router 实现多页面路由系统
- 零自定义 CSS 文件，降低维护成本
- 配置 PostCSS 处理器，支持现代 CSS 特性
- TypeScript 支持，提供类型安全
- 热更新支持，实时预览更改

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器将在 http://localhost:3001 启动。

### 构建项目

```bash
npm run build
```

构建输出将位于 `dist` 目录中。

## 项目结构

```
antd-demo/
├── public/                # 静态资源
│   ├── index.html         # HTML 模板
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── components/        # 共享组件
│   │   └── Layout.tsx     # 主布局组件
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 首页
│   │   ├── Form.tsx       # 表单页面
│   │   ├── List.tsx       # 列表页面
│   │   └── NotFound.tsx   # 404页面
│   ├── App.tsx            # 路由配置
│   ├── index.tsx          # 入口文件
│   └── index.css          # 仅包含Tailwind指令的全局样式
├── postcss.config.js      # PostCSS 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── rspack.config.js       # Rspack 配置
├── package.json           # 项目配置
└── tsconfig.json          # TypeScript 配置
```

## 路由系统

这个项目使用 React Router v6 实现了完整的路由系统：

- **嵌套路由**：使用 `<Outlet />` 组件实现主布局内的内容区域
- **页面组件**：每个路由对应一个独立的页面组件
- **导航菜单**：左侧菜单通过读取当前路径自动高亮当前页面
- **404 处理**：包含自定义 404 页面，处理未找到的路由
- **HTML5 历史模式**：使用 BrowserRouter 实现干净的 URL，无需 hash (#)

可用的路由：

- `/` - 首页
- `/form` - 表单页面
- `/list` - 列表页面
- `/*` - 404 页面（任何未匹配的路径）

## 设计理念

这个项目展示了如何将 Ant Design 组件与 Tailwind CSS 工具类无缝集成，同时遵循以下设计原则：

### 零 CSS 文件

- 移除所有自定义 CSS 文件，仅保留 Tailwind 指令
- 使用 Tailwind 的 `@apply` 指令简化全局样式
- 完全通过 HTML 类名控制样式，提高可维护性

### 样式分层

我们在这个项目中采用了三层样式策略：

1. **组件层** - Ant Design 组件提供基础 UI 元素和交互
2. **布局层** - Tailwind 类用于处理间距、布局和响应式设计
3. **美化层** - Tailwind 类用于处理颜色、阴影、圆角等视觉效果

### Ant Design 与 Tailwind 协同工作

- Ant Design 组件接受 Tailwind 类通过 `className` 属性
- Tailwind 的 `preflight` 样式已禁用，避免与 Ant Design 冲突
- 布局优先使用 Tailwind 栅格和 flexbox，而不是 Ant Design 的 Row/Col

## 技术栈

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [PostCSS](https://postcss.org/)
- [Rspack](https://www.rspack.dev/)

## 许可证

ISC
