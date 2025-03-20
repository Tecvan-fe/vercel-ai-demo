import React from 'react';
import { Typography, Card, Button, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <Title level={2}>首页</Title>
      <Paragraph>欢迎使用基于 Rspack、Ant Design 和 Tailwind CSS 构建的 React 应用程序！</Paragraph>

      {/* Tailwind CSS 示例 */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Tailwind CSS 样式示例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border border-gray-200 hover:shadow-lg transition-shadow">
            <p className="text-gray-700">这是一个使用 Tailwind CSS 样式的卡片</p>
            <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Tailwind 按钮
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded text-white">
            <p className="font-semibold">渐变背景与响应式设计</p>
            <div className="flex space-x-2 mt-3">
              <span className="px-2 py-1 bg-white/20 rounded text-xs">标签 1</span>
              <span className="px-2 py-1 bg-white/20 rounded text-xs">标签 2</span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <Card title="欢迎" className="mb-6 shadow-md">
        <p className="text-gray-700 mb-4">这是一个展示 React Router 路由系统的示例应用。</p>
        <p className="text-gray-700 mb-4">请使用左侧菜单导航到不同页面。</p>
        <div className="flex space-x-4">
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
