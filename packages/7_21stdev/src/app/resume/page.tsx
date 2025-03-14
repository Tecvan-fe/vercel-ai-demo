'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Github, Linkedin } from 'lucide-react';
import { ResumeProfile } from '../../components/resume-profile';
import { LoginDialog } from '../../components/login-dialog';
import { FrontendRoadmap } from '../../components/ui/frontend-roadmap';
import { BackendRoadmap } from '../../components/ui/backend-roadmap';
import { ResumeChat } from '../../components/ui/resume-chat';

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend'>('frontend');

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="container mx-auto py-4 flex items-center justify-between">
        <div className="text-xl font-bold">21st Dev UI 组件</div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-foreground/80 hover:text-foreground">
            首页
          </Link>
          <Link href="/globe" className="text-foreground/80 hover:text-foreground">
            地球仪
          </Link>
          <Link href="/resume" className="text-foreground/80 hover:text-foreground font-medium">
            简历
          </Link>
          <a href="#" className="text-foreground/80 hover:text-foreground">
            文档
          </a>
          <LoginDialog />
        </nav>
      </header>

      <main className="min-h-screen bg-background p-4 md:p-8">
        <ResumeProfile />

        {/* 技术路线图部分 */}
        <div className="max-w-7xl mx-auto mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-center">我的技术栈路线图</h2>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('frontend')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'frontend'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border'
              }`}
            >
              前端开发
            </button>
            <button
              onClick={() => setActiveTab('backend')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'backend'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border'
              }`}
            >
              后端开发
            </button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            {activeTab === 'frontend' ? <FrontendRoadmap /> : <BackendRoadmap />}
          </div>
        </div>

        {/* 工作经验部分 */}
        <div className="max-w-5xl mx-auto mt-16 space-y-12">
          <section className="bg-background border border-border rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">工作经验</h2>

            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-border">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                <div className="mb-2">
                  <h3 className="text-xl font-semibold">高级全栈开发工程师</h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500">
                    <span>科技公司</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
                    <span>2020年 - 至今</span>
                  </div>
                </div>
                <p className="text-foreground mb-4">
                  负责公司核心产品的前端和后端开发，优化用户体验和系统性能。使用React、Node.js和AWS技术栈构建可扩展的应用程序。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    React
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Node.js
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    AWS
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Docker
                  </span>
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-border">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                <div className="mb-2">
                  <h3 className="text-xl font-semibold">前端开发工程师</h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500">
                    <span>互联网公司</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
                    <span>2018年 - 2020年</span>
                  </div>
                </div>
                <p className="text-foreground mb-4">
                  负责公司网站和Web应用程序的前端开发，实现响应式设计和交互功能。使用Vue.js和相关技术栈构建用户界面。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Vue.js
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    JavaScript
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    CSS3
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    HTML5
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 项目部分 */}
          <section className="bg-background border border-border rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">项目经验</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">企业管理系统</h3>
                <p className="text-foreground mb-4">
                  开发了一个全功能的企业资源管理系统，包括客户关系管理、库存管理和财务报表功能。
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    React
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Node.js
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    MongoDB
                  </span>
                </div>
                <Link href="#" className="text-primary hover:underline inline-flex items-center">
                  查看详情 <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">电子商务平台</h3>
                <p className="text-foreground mb-4">
                  构建了一个现代化的电子商务平台，支持产品展示、购物车、支付集成和订单管理功能。
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Vue.js
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    Express
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs">
                    PostgreSQL
                  </span>
                </div>
                <Link href="#" className="text-primary hover:underline inline-flex items-center">
                  查看详情 <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* 教育背景部分 */}
          <section className="bg-background border border-border rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">教育背景</h2>

            <div className="space-y-6">
              <div className="relative pl-8 border-l-2 border-border">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                <div className="mb-2">
                  <h3 className="text-xl font-semibold">计算机科学硕士</h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500">
                    <span>知名大学</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
                    <span>2016年 - 2018年</span>
                  </div>
                </div>
                <p className="text-foreground">
                  专注于软件工程和人工智能领域，参与了多个研究项目，并发表了相关学术论文。
                </p>
              </div>

              <div className="relative pl-8 border-l-2 border-border">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                <div className="mb-2">
                  <h3 className="text-xl font-semibold">计算机科学学士</h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-500">
                    <span>知名大学</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-500"></span>
                    <span>2012年 - 2016年</span>
                  </div>
                </div>
                <p className="text-foreground">
                  学习了计算机科学的基础知识和核心技能，包括算法、数据结构、操作系统和软件开发方法论。
                </p>
              </div>
            </div>
          </section>

          {/* 联系部分 */}
          <section id="contact" className="bg-background border border-border rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">联系我</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-foreground">
                  如果您对我的工作感兴趣，或者想要讨论潜在的合作机会，请随时通过以下方式联系我。
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>example@example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-primary" />
                    <span>github.com/username</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-primary" />
                    <span>linkedin.com/in/username</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">发送消息</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      姓名
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="您的姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="您的邮箱"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      消息
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="您的消息"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    发送消息
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 添加简历专用聊天机器人 */}
      <ResumeChat />
    </div>
  );
}
