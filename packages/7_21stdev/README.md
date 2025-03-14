# 21st Dev UI 组件

这个包包含了一系列现代化的 UI 组件，包括 3D 场景渲染组件。

## 安装

```bash
pnpm install
```

## 组件

### SplineScene

用于渲染 Spline 3D 场景的组件。

```tsx
import { SplineScene } from './components/ui/splite';

<SplineScene
  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
  className="w-full h-full"
/>;
```

### Spotlight

创建聚光灯效果的组件。

```tsx
import { Spotlight } from './components/ui/spotlight';

<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />;
```

### Card

基础卡片组件。

```tsx
import { Card } from './components/ui/card';

<Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">{/* 内容 */}</Card>;
```

## 示例

查看 `components/ui/code.demo.tsx` 文件获取完整示例。
