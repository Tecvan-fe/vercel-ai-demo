import React from 'react';
import { Typography, Card, Row, Col, Divider } from 'antd';
import { PieChartOutlined, DesktopOutlined, DatabaseOutlined } from '@ant-design/icons';
import TopNav from '../components/TopNav';

const { Title, Paragraph } = Typography;

// 图片导入（示例URL，实际开发中应该导入本地图片或使用项目中的图片资源）
const image1Url =
  'https://images.unsplash.com/photo-1516131206008-dd041a9764fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80';
const image2Url =
  'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80';
const image3Url =
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80';

const About: React.FC = () => {
  return (
    <>
      <TopNav />
      <div className="space-y-12 max-w-7xl mx-auto px-4 py-10">
        {/* 关于我们标题部分 */}
        <div className="text-center">
          <Title level={1}>关于我们</Title>
          <Paragraph className="text-gray-600 text-lg">
            dolor sit amet, consectetur adipisicing elit
          </Paragraph>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* 主要介绍文本 */}
        <div className="max-w-4xl mx-auto text-center py-6">
          <Paragraph className="text-base text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit necessitatibus officiis
            repudiandae est deserunt delectus dolorem iure porro distinctio fuga, nostrum
            doloremque. Facilis porro in laborum dolor amet ratione hic? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Magnam aut a porro, adipisci quidem sint enim pariatur
            ducimus, saepe voluptatibus inventore commodi! Quis, explicabo molestias libero tenetur
            temporibus perspiciatis deserunt.
          </Paragraph>
        </div>

        {/* 特性部分 */}
        <Row gutter={[32, 32]} className="mt-12">
          <Col xs={24} md={8}>
            <Card className="text-center h-full shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <PieChartOutlined className="text-5xl text-blue-500" />
              </div>
              <Title level={3}>高性能</Title>
              <Paragraph className="text-gray-600">
                cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation
                fabulas abhorreant. His ex mandamus.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <DesktopOutlined className="text-5xl text-blue-500" />
              </div>
              <Title level={3}>扁平设计</Title>
              <Paragraph className="text-gray-600">
                cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation
                fabulas abhorreant. His ex mandamus.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <DatabaseOutlined className="text-5xl text-blue-500" />
              </div>
              <Title level={3}>简化工作流</Title>
              <Paragraph className="text-gray-600">
                cu nostro dissentias consectetuer mel. Ut admodum conceptam mei, cu eam tation
                fabulas abhorreant. His ex mandamus.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider className="my-20" />

        {/* 关键特性和优势部分 */}
        <div className="text-center mb-12">
          <Title level={2}>核心特性与优势</Title>
          <Paragraph className="text-gray-600">
            Obcaecati consequatur libero repudiandae, aperiam itaque laborum!
          </Paragraph>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* 特性图片部分 */}
        <Row gutter={[32, 32]} className="mt-8">
          <Col xs={24} md={8}>
            <div className="bg-gray-200 h-64 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={image1Url} alt="Feature 1" className="w-full h-full object-cover" />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="bg-gray-200 h-64 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={image2Url} alt="Feature 2" className="w-full h-full object-cover" />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="bg-gray-200 h-64 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img src={image3Url} alt="Feature 3" className="w-full h-full object-cover" />
            </div>
          </Col>
        </Row>

        {/* 返回顶部按钮 */}
        <div className="text-center pt-12">
          <a
            href="#top"
            className="inline-block p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
