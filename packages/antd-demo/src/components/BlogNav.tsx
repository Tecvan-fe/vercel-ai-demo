import React from 'react';
import { Menu, Button, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { GithubOutlined } from '@ant-design/icons';

const { Header } = Layout;

const navItems = [
  { key: 'home', label: '范文杰的博客', path: '/' },
  { key: 'coding', label: '通往工程化之路', path: '/blog' },
  { key: 'webpack', label: 'Webpack 技术揭秘', path: '/webpack' },
  { key: 'about', label: '关于我', path: '/about' },
];

interface NavItemProps {
  label: string;
  path: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, path, active }) => {
  return (
    <Link
      to={path}
      className={`px-4 py-2 mx-1 text-sm ${
        active ? 'text-blue-500 font-medium' : 'text-gray-700 hover:text-blue-500'
      }`}
    >
      {label}
    </Link>
  );
};

const BlogNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Header className="bg-white shadow-sm px-4 md:px-8 py-0 flex items-center justify-between h-16 border-b border-gray-200">
      <div className="flex items-center h-full">
        {/* 博客Logo */}
        <Link to="/" className="flex items-center mr-8">
          <img
            src="https://avatar.example.com/avatar.jpg"
            alt="博主头像"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-lg font-medium hidden sm:inline">范文杰的博客</span>
        </Link>

        {/* 导航菜单 */}
        <div className="flex items-center h-full">
          {navItems.slice(1).map((item) => (
            <NavItem
              key={item.key}
              label={item.label}
              path={item.path}
              active={currentPath === item.path}
            />
          ))}
        </div>
      </div>

      {/* 右侧按钮 */}
      <div className="flex items-center">
        <Button
          type="text"
          icon={<GithubOutlined className="text-lg" />}
          href="https://github.com"
          target="_blank"
          className="flex items-center justify-center"
        />
        <Button
          type="text"
          icon={
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"></path>
              <path d="M12 7v6h5"></path>
            </svg>
          }
        />
      </div>
    </Header>
  );
};

export default BlogNav;
