import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  SettingOutlined,
  TeamOutlined,
  BranchesOutlined,
  TagsOutlined,
  FileTextOutlined,
  ApiOutlined,
  RobotOutlined,
  FileProtectOutlined,
  KeyOutlined,
  BulbOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  NotificationOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

const items = [
  {
    key: 'general',
    label: 'General',
    icon: <SettingOutlined />,
    path: '/github-settings/general',
  },
  {
    key: 'access',
    label: 'Access',
    type: 'group',
    children: [
      {
        key: 'collaborators',
        label: 'Collaborators and teams',
        icon: <TeamOutlined />,
        path: '/github-settings/access/collaborators',
      },
    ],
  },
  {
    key: 'code',
    label: 'Code and automation',
    type: 'group',
    children: [
      {
        key: 'branches',
        label: 'Branches',
        icon: <BranchesOutlined />,
        path: '/github-settings/branches',
      },
      {
        key: 'tags',
        label: 'Tags',
        icon: <TagsOutlined />,
        path: '/github-settings/tags',
      },
      {
        key: 'rules',
        label: 'Rules',
        icon: <FileTextOutlined />,
        path: '/github-settings/rules',
      },
      {
        key: 'actions',
        label: 'Actions',
        icon: <RobotOutlined />,
        path: '/github-settings/actions',
      },
      {
        key: 'webhooks',
        label: 'Webhooks',
        icon: <ApiOutlined />,
        path: '/github-settings/webhooks',
      },
      {
        key: 'environments',
        label: 'Environments',
        icon: <AppstoreOutlined />,
        path: '/github-settings/environments',
      },
      {
        key: 'codespaces',
        label: 'Codespaces',
        icon: <AppstoreOutlined />,
        path: '/github-settings/codespaces',
      },
      {
        key: 'pages',
        label: 'Pages',
        icon: <FileTextOutlined />,
        path: '/github-settings/pages',
      },
      {
        key: 'properties',
        label: 'Custom properties',
        icon: <FileTextOutlined />,
        path: '/github-settings/properties',
      },
    ],
  },
  {
    key: 'security',
    label: 'Security',
    type: 'group',
    children: [
      {
        key: 'code-security',
        label: 'Code security',
        icon: <SafetyCertificateOutlined />,
        path: '/github-settings/security/code',
      },
      {
        key: 'deploy-keys',
        label: 'Deploy keys',
        icon: <KeyOutlined />,
        path: '/github-settings/security/keys',
      },
      {
        key: 'secrets',
        label: 'Secrets and variables',
        icon: <FileProtectOutlined />,
        path: '/github-settings/secrets',
      },
    ],
  },
  {
    key: 'integrations',
    label: 'Integrations',
    type: 'group',
    children: [
      {
        key: 'github-apps',
        label: 'GitHub Apps',
        icon: <AppstoreOutlined />,
        path: '/github-settings/apps',
      },
      {
        key: 'email-notifications',
        label: 'Email notifications',
        icon: <NotificationOutlined />,
        path: '/github-settings/notifications',
      },
      {
        key: 'autolink',
        label: 'Autolink references',
        icon: <UserSwitchOutlined />,
        path: '/github-settings/autolink',
      },
    ],
  },
];

const GithubSettingsSidebar: React.FC = () => {
  const location = useLocation();

  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;

    // 默认选中 secrets 页面
    if (path === '/github-settings') return 'secrets';

    // 遍历所有菜单项，查找匹配路径
    for (const group of items) {
      if (group.children) {
        for (const item of group.children) {
          if (path.includes(item.key)) return item.key;
        }
      } else {
        if (path.includes(group.key)) return group.key;
      }
    }

    return 'secrets';
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full">
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ width: 250, borderRight: 0 }}
        items={items.map((group) => {
          if (group.children) {
            return {
              key: group.key,
              type: 'group',
              label: group.label,
              children: group.children.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.path}>{item.label}</Link>,
              })),
            };
          }
          return {
            key: group.key,
            icon: group.icon,
            label: <Link to={group.path}>{group.label}</Link>,
          };
        })}
      />
    </div>
  );
};

export default GithubSettingsSidebar;
