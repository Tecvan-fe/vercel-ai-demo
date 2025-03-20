import React from 'react';
import { Typography, Divider, Card, Space, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;

const BlogPost: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-white my-8 rounded-lg shadow-sm">
      <div className="mb-8">
        <Title level={1} className="text-3xl font-bold mb-8">
          前端工程化系列一: 序言
        </Title>

        <div className="blog-content text-base leading-relaxed">
          <Paragraph className="text-lg leading-8 text-gray-800">
            我认为，工程化是前端各类细分技术领域中最为基础而关键，最具有知识广度与深度因而学习曲线较为陡峭，但同时也是对体快开发效率、质量提升最大因而对个体而言最具有学习价值的高阶技能之一。
          </Paragraph>

          <Paragraph className="text-lg leading-8 text-gray-800 my-6">
            具体来说，工程化领域向上可以探索学习各种构建工具、静态代码分析工具、CI/CD
            与开发工作流等具工具；横向可以真研判、梳理，落地各类研发规则，提前帮助业务开发者做出技术选择，以实现更高效而规范地业务运行；向下可以深入挖掘编译、集成、发布、运维等各个研发阶段的目标、量任实践与核心矛盾，引入或自研各类工具实现研发任务的自动化与高效的质量防务化措施。
          </Paragraph>

          <Paragraph className="text-lg leading-8 text-gray-800 my-6">
            综合来看，效率收益明确，技术探索空间比常规的前端功能开发高出许多，是一个非常适合中高阶工程师发展的方向。
          </Paragraph>

          <Paragraph className="text-lg leading-8 text-gray-800 my-6">
            但也许正是因为这种纷繁复杂，社区很少见到关于前端工程化系具体系统化，实用性，深度的高质量知识经验整理，大多数资料还是过度聚焦在具体工具的应用，优化与原理层面，并未触及所谓前端工程化的根本内核，碰巧我个人一直对这个方向抱有浓厚兴趣，加上最近几年工作内容主要聚焦在大规模复杂多工程的处理上，沉淀的不少经验与思考，因此计划撰写一系列文章，讲解前端工程化的内核与拓补，各阶段的目标与核心矛盾，相关的工具、实践、管理策略、最佳实践等内容，希望能一次性讲好工程管理这个高级话题，感兴趣的同学欢迎关注我的个人公众号。
          </Paragraph>
        </div>
      </div>

      <Divider className="my-8" />

      <Card className="bg-green-100 border-0 rounded-md overflow-hidden">
        <Row gutter={16} align="middle" justify="center">
          <Col xs={24} sm={8}>
            <div className="flex justify-center">
              <img
                src="https://placeholder.com/200x200"
                alt="微信公众号二维码"
                className="w-36 h-36"
              />
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0">
              <Space direction="vertical" size="large" className="w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#07C160">
                      <path d="M2.224 21.667s4.24-1.825 4.788-2.056C15.029 23.641 22 17.337 22 10.999 22 5.582 17.513 1 12 1S2 5.582 2 10.999c0 1.748.514 3.397 1.465 4.861.633.975.773 2.137.417 3.365-.24.83-.628 1.841-1.658 2.442zM9.004 8.252c-.801 0-1.45-.662-1.45-1.488s.649-1.488 1.45-1.488c.8 0 1.45.662 1.45 1.488s-.65 1.488-1.45 1.488zm6.094.008c-.801 0-1.45-.662-1.45-1.488s.649-1.488 1.45-1.488c.8 0 1.45.662 1.45 1.488s-.65 1.488-1.45 1.488z" />
                    </svg>
                  </div>
                  <Text strong className="text-xl">
                    微信搜一搜
                  </Text>
                </div>
                <div className="flex justify-center sm:justify-start w-full">
                  <div className="bg-white rounded-md px-6 py-3 shadow-sm flex items-center">
                    <Text className="text-gray-700 text-2xl font-medium">tecvan</Text>
                  </div>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
        <div className="text-center mt-4">
          <Text className="text-gray-500">打开"微信/发现/搜一搜"搜索</Text>
        </div>
      </Card>
    </div>
  );
};

export default BlogPost;
