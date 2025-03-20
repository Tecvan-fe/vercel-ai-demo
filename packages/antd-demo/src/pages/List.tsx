import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Pagination,
  Avatar,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
  avatar: string;
}

const data: DataType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
    tags: ['开发', '设计'],
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
    tags: ['市场'],
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
  },
  {
    key: '3',
    name: '王五',
    age: 32,
    address: '广州市天河区',
    tags: ['财务', 'HR'],
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3',
  },
  {
    key: '4',
    name: '赵六',
    age: 36,
    address: '深圳市南山区',
    tags: ['开发'],
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=4',
  },
  {
    key: '5',
    name: '钱七',
    age: 28,
    address: '杭州市西湖区',
    tags: ['设计', 'UI'],
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=5',
  },
];

const colorMap: Record<string, string> = {
  开发: 'blue',
  设计: 'green',
  市场: 'orange',
  财务: 'purple',
  HR: 'magenta',
  UI: 'cyan',
};

const ListPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const columns: ColumnsType<DataType> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            const color = colorMap[tag] || 'geekblue';
            return (
              <Tag color={color} key={tag} className="mr-1 mb-1">
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">
            查看
          </Button>
          <Button type="link" size="small">
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = data.filter((item) => {
    const matchesSearch = searchText
      ? item.name.includes(searchText) || item.address.includes(searchText)
      : true;
    const matchesTag = filterTag ? item.tags.includes(filterTag) : true;
    return matchesSearch && matchesTag;
  });

  // 所有可用标签
  const allTags = Array.from(new Set(data.flatMap((item) => item.tags))).sort();

  return (
    <div className="space-y-6">
      <Title level={2}>列表示例</Title>
      <Paragraph>
        这个页面展示了使用 Ant Design 的表格组件，结合 Tailwind CSS 创建的数据列表。
      </Paragraph>

      <Card title="用户列表" className="shadow-md">
        <div className="flex flex-wrap gap-4 mb-4">
          <Search
            placeholder="搜索姓名或地址"
            allowClear
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="按标签筛选"
            allowClear
            className="w-40"
            onChange={(value) => setFilterTag(value)}
          >
            {allTags.map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
          <div className="flex-grow"></div>
          <Button type="primary">添加用户</Button>
        </div>

        <Table columns={columns} dataSource={filteredData} pagination={false} className="mb-4" />

        <div className="flex justify-end">
          <Pagination defaultCurrent={1} total={filteredData.length} />
        </div>
      </Card>
    </div>
  );
};

export default ListPage;
