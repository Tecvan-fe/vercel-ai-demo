import React from 'react';
import { Typography, Card, Form, Input, Button, Select, DatePicker, Checkbox, message } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface FormValues {
  username: string;
  password: string;
  email: string;
  gender: string;
  birthdate: Date;
  interests: string[];
  agreement: boolean;
}

const FormPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    console.log('表单提交成功:', values);
    message.success('表单提交成功！');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('表单提交失败:', errorInfo);
    message.error('表单提交失败，请检查输入！');
  };

  return (
    <div className="space-y-6">
      <Title level={2}>表单示例</Title>
      <Paragraph>
        这个页面展示了使用 Ant Design 和 Tailwind CSS 创建的各种表单元素和布局。
      </Paragraph>

      <Card title="基础表单" className="shadow-md">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ agreement: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="max-w-3xl"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别！' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item label="出生日期" name="birthdate">
            <DatePicker className="w-full" placeholder="请选择出生日期" />
          </Form.Item>

          <Form.Item label="兴趣爱好" name="interests">
            <Select mode="multiple" placeholder="请选择兴趣爱好">
              <Option value="reading">阅读</Option>
              <Option value="sports">运动</Option>
              <Option value="music">音乐</Option>
              <Option value="travel">旅行</Option>
              <Option value="coding">编程</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 18 }}
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请同意协议')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意<a href="#">服务条款</a>和<a href="#">隐私政策</a>
            </Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <div className="flex space-x-4">
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormPage;
