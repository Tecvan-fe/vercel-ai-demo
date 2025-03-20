import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import {
  HomeOutlined,
  FormOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  path: string;
};

const items: MenuItem[] = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: '首页',
    path: '/',
  },
  {
    key: '2',
    icon: <FormOutlined />,
    label: '表单',
    path: '/form',
  },
  {
    key: '3',
    icon: <UnorderedListOutlined />,
    label: '列表',
    path: '/list',
  },
  {
    key: '4',
    icon: <InfoCircleOutlined />,
    label: '关于我们',
    path: '/about',
  },
  {
    key: '5',
    icon: <GithubOutlined />,
    label: 'GitHub设置',
    path: '/github-settings',
  },
];

// 特殊页面布局 - 不包含侧边栏的页面路径
const specialLayoutPaths = ['/about'];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据当前路径找到对应的菜单项key
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const menuItem = items.find((item) => item.path === currentPath);
    return menuItem ? [menuItem.key] : ['1']; // 默认选中首页
  };

  const handleMenuClick = (key: string) => {
    const menuItem = items.find((item) => item.key === key);
    if (menuItem) {
      if (menuItem.path === '/github-settings') {
        // 对于 GitHub 设置页面，传递状态表示从默认布局访问
        navigate(menuItem.path, { state: { fromDefaultLayout: true } });
      } else {
        navigate(menuItem.path);
      }
    }
  };

  // 检查当前路径是否使用特殊布局
  const isSpecialLayout = specialLayoutPaths.some((path) => location.pathname.startsWith(path));

  // 对于特殊页面，直接渲染内容
  if (isSpecialLayout) {
    return <Outlet />;
  }

  // 默认布局
  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="min-h-screen"
      >
        <div className="p-4 h-16 flex items-center justify-center bg-white/10 mb-4">
          <h1
            className={`text-white transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}
          >
            Ant Design Demo
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.key),
          }))}
        />
      </Sider>
      <Layout>
        <Header className="p-0 bg-white flex items-center justify-end px-4">
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-username/ant-design-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <GithubOutlined className="text-xl" />
            </a>
          </div>
        </Header>
        <Content className="mx-4">
          <div
            className="p-6 mt-4 min-h-[360px] bg-white rounded-lg shadow-md"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer className="text-center text-gray-500">
          Ant Design Demo ©{new Date().getFullYear()} Created with Rspack, React & Tailwind CSS
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
