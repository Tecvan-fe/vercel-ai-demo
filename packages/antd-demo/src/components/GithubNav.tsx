import React from 'react';
import { Layout, Menu, Input, Avatar, Dropdown, Button, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  GithubOutlined,
  BellOutlined,
  PlusOutlined,
  UserOutlined,
  CaretDownOutlined,
  BookOutlined,
  EyeOutlined,
  StarOutlined,
  ForkOutlined,
  SearchOutlined,
  CodeOutlined,
  IssuesCloseOutlined,
  PullRequestOutlined,
  PlayCircleOutlined,
  ProjectOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  GithubFilled,
} from '@ant-design/icons';

const { Header } = Layout;

const navItems = [
  { key: 'code', label: 'Code', icon: <CodeOutlined /> },
  { key: 'issues', label: 'Issues', icon: <IssuesCloseOutlined /> },
  { key: 'pull-requests', label: 'Pull requests', icon: <PullRequestOutlined /> },
  { key: 'actions', label: 'Actions', icon: <PlayCircleOutlined /> },
  { key: 'projects', label: 'Projects', icon: <ProjectOutlined /> },
  { key: 'security', label: 'Security', icon: <SecurityScanOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
];

interface GithubNavProps {
  selectedKey?: string;
}

const GithubNav: React.FC<GithubNavProps> = ({ selectedKey = 'settings' }) => {
  const location = useLocation();

  // 使用路径确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('settings')) return 'settings';
    return selectedKey;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* 顶部导航 */}
      <div className="bg-gray-900 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GithubFilled className="text-2xl text-white" />
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Type / to search"
              className="bg-gray-800 border-gray-700 rounded-md w-64"
              size="small"
            />
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ backgroundColor: 'transparent', border: 'none', fontSize: '14px' }}
              items={[
                { key: 'pull', label: 'Pull requests' },
                { key: 'issues', label: 'Issues' },
                { key: 'codespaces', label: 'Codespaces' },
                { key: 'marketplace', label: 'Marketplace' },
                { key: 'explore', label: 'Explore' },
              ]}
            />
          </div>
          <div className="flex items-center space-x-3">
            <BellOutlined className="text-lg" />
            <Dropdown menu={{ items: [] }} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <PlusOutlined className="text-lg" />
                <CaretDownOutlined className="text-xs ml-1" />
              </div>
            </Dropdown>
            <Dropdown menu={{ items: [] }} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar size="small" icon={<UserOutlined />} />
                <CaretDownOutlined className="text-xs ml-1" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* 仓库信息 */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <BookOutlined className="mr-2 text-gray-500" />
            <span className="text-sm">
              <Link to="/" className="text-blue-600 hover:underline">
                coze-dev
              </Link>
              {' / '}
              <Link to="/" className="text-blue-600 hover:underline font-semibold">
                coze-space-web
              </Link>
            </span>
            <span className="ml-2 px-1 py-0.5 text-xs border border-gray-300 rounded-full">
              Public
            </span>
          </div>
        </div>
      </div>

      {/* 页面导航 */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={navItems.map((item) => ({
              key: item.key,
              label: (
                <span className="flex items-center">
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                  {item.key === 'issues' && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">23</span>
                  )}
                </span>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default GithubNav;
