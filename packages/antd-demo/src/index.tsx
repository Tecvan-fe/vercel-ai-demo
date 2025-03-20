import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 导入Ant Design图标
import { createFromIconfontCN } from '@ant-design/icons';

// 配置自定义图标（可选）
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

// 为全局对象添加IconFont
(window as any).IconFont = IconFont;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
