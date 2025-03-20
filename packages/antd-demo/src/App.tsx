import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// 布局和页面
import AppLayout from './components/Layout';
import BlogLayout from './components/BlogLayout';
import Home from './pages/Home';
import FormPage from './pages/Form';
import ListPage from './pages/List';
import About from './pages/About';
import NotFound from './pages/NotFound';
import GithubSettings from './pages/GithubSettings';
import BlogPost from './pages/BlogPost';
import FlowchartPage from './pages/flowchart';
import PageTransition from './components/PageTransition';

// 特殊页面 - 这些页面使用自己的布局，不需要页面过渡动画
const specialPages = ['/about'];

// GitHub 设置页面 - 根据路由状态决定是否使用特殊布局
const GithubSettingsRoute = () => {
  const location = useLocation();

  // 如果有 state 且 fromDefaultLayout 为 true，则使用默认布局
  if (location.state && (location.state as any).fromDefaultLayout) {
    return <GithubSettings />;
  }

  // 否则默认为完整 GitHub 风格布局
  return <GithubSettings />;
};

// 创建带动画的路由容器
const AnimatedRoutes = () => {
  const location = useLocation();
  const isSpecialPage = specialPages.some((path) => location.pathname.startsWith(path));

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 特殊页面路由 - 使用自己的布局 */}
        <Route path="/about" element={<About />} />

        {/* 博客布局路由 */}
        <Route path="/blog" element={<BlogLayout />}>
          <Route
            index
            element={
              <PageTransition>
                <BlogPost />
              </PageTransition>
            }
          />
        </Route>

        {/* 流程图页面 - 使用自己的布局 */}
        <Route path="/flowchart" element={<FlowchartPage />} />

        {/* 默认布局路由 */}
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="form"
            element={
              <PageTransition>
                <FormPage />
              </PageTransition>
            }
          />
          <Route
            path="list"
            element={
              <PageTransition>
                <ListPage />
              </PageTransition>
            }
          />
          <Route
            path="github-settings"
            element={
              <PageTransition>
                <GithubSettingsRoute />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
