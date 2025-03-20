import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Button, Table, Space, Tag, Tooltip, Divider, Empty } from 'antd';
import {
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  GithubOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import GithubNav from '../components/GithubNav';
import GithubSettingsSidebar from '../components/GithubSettingsSidebar';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

interface Secret {
  name: string;
  updatedAt: string;
  isLocked?: boolean;
}

const GithubSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('secrets');
  const location = useLocation();
  const navigate = useNavigate();

  // 判断当前是否在默认布局模式下
  const isInDefaultLayout =
    location.pathname === '/github-settings' &&
    location.state &&
    (location.state as any).fromDefaultLayout;

  // 返回应用默认布局
  const backToDefaultLayout = () => {
    navigate('/github-settings', { replace: true, state: { fromDefaultLayout: true } });
  };

  // 切换到 GitHub 风格界面
  const switchToGithubStyle = () => {
    navigate('/github-settings', { replace: true });
  };

  // 模拟数据
  const repositorySecrets: Secret[] = [
    { name: 'CODECOV_TOKEN', updatedAt: '2 days ago' },
    { name: 'LARK_WEBHOOK_URL', updatedAt: '6 hours ago' },
    { name: 'NODE_AUTH_TOKEN', updatedAt: 'last week' },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <LockOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Last updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#888' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: any, record: Secret) => (
        <Space>
          <Tooltip title="Edit secret">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Delete secret">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 页面内容部分 - 可复用于两种布局模式
  const contentSection = (
    <>
      <div className="mb-8">
        <Title level={2} className="flex items-center justify-between">
          Actions secrets and variables
          {isInDefaultLayout ? (
            <Button icon={<GithubOutlined />} className="ml-4" onClick={switchToGithubStyle}>
              切换到 GitHub 风格界面
            </Button>
          ) : null}
        </Title>
        <Paragraph className="text-gray-600">
          Secrets and variables allow you to manage reusable configuration data. Secrets are{' '}
          <Text strong>encrypted</Text> and are used for sensitive data. Variables are shown as
          plain text and are used for <Text strong>non-sensitive</Text> data.
          <a href="#" className="ml-2">
            Learn more about encrypted secrets
          </a>
          .
          <a href="#" className="ml-2">
            Learn more about variables
          </a>
          .
        </Paragraph>
        <Paragraph className="text-gray-600">
          Anyone with collaborator access to this repository can use these secrets and variables for
          actions. They are not passed to workflows that are triggered by a pull request from a
          fork.
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" className="mb-6">
        <TabPane tab="Secrets" key="secrets" />
        <TabPane tab="Variables" key="variables" />
      </Tabs>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <Title level={5} className="m-0">
            Environment secrets
          </Title>
          <Button type="primary" icon={<PlusOutlined />}>
            New repository secret
          </Button>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <Empty
            description="This environment has no secrets"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="primary" className="mt-4" icon={<PlusOutlined />}>
            Manage environment secrets
          </Button>
        </div>
      </div>

      <Divider />

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <Title level={5} className="m-0">
            Repository secrets
          </Title>
          <Button type="primary" icon={<PlusOutlined />}>
            New repository secret
          </Button>
        </div>

        <Table dataSource={repositorySecrets} columns={columns} rowKey="name" pagination={false} />
      </div>

      <Divider />

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <Title level={5} className="m-0">
            Organization secrets
          </Title>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <Empty
            description="There are no organization secrets available to this repository"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button className="mt-4">Manage organization secrets</Button>
        </div>
      </div>
    </>
  );

  // 如果在默认布局中（通过侧边导航栏访问），只渲染内容部分
  if (isInDefaultLayout) {
    return contentSection;
  }

  // 如果是直接访问 /github-settings 路径，使用完整布局
  return (
    <>
      <GithubNav selectedKey="settings" />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {/* 侧边栏 */}
            <div className="w-64 min-h-screen">
              <GithubSettingsSidebar />
              {/* 返回按钮 */}
              <div className="p-4 border-t border-gray-200">
                <Button icon={<HomeOutlined />} block onClick={backToDefaultLayout}>
                  返回应用布局
                </Button>
              </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 p-6">{contentSection}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GithubSettings;
