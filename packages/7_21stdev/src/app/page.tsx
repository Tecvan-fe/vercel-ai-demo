'use client';

import React from 'react';
import { SplineSceneBasic } from '../components/ui/code.demo';
import { LoginDialog } from '../components/login-dialog';
import { TabbarChat } from '../components/ui/tabbar-chat';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-4 flex items-center justify-between">
        <div className="text-xl font-bold">21st Dev UI 组件</div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-foreground/80 hover:text-foreground font-medium">
            首页
          </Link>
          <Link href="/globe" className="text-foreground/80 hover:text-foreground">
            地球仪
          </Link>
          <Link href="/resume" className="text-foreground/80 hover:text-foreground">
            简历
          </Link>
          <a href="#" className="text-foreground/80 hover:text-foreground">
            组件
          </a>
          <a href="#" className="text-foreground/80 hover:text-foreground">
            文档
          </a>
          <LoginDialog />
        </nav>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-between p-24">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl font-bold mb-8">3D 场景演示</h1>
          <SplineSceneBasic />
        </div>
      </main>

      <TabbarChat />
    </div>
  );
}
