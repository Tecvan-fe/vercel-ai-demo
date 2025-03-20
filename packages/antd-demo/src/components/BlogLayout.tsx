import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import BlogNav from './BlogNav';

const { Content, Footer } = Layout;

const BlogLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <BlogNav />
      <Content className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center text-gray-500 bg-white">
        © {new Date().getFullYear()} 范文杰的博客 | 使用 React、Ant Design 和 Tailwind CSS 构建
      </Footer>
    </Layout>
  );
};

export default BlogLayout;
