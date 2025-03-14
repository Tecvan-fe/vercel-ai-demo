'use client';

import React from 'react';
import { Globe } from '../../components/ui/globe';
import Link from 'next/link';
import { LoginDialog } from '../../components/login-dialog';

export default function GlobePage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="container mx-auto py-4 flex items-center justify-between">
        <div className="text-xl font-bold">21st Dev UI 组件</div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-foreground/80 hover:text-foreground">
            首页
          </Link>
          <Link href="/globe" className="text-foreground/80 hover:text-foreground font-medium">
            地球仪
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

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            交互式地球仪
          </h1>
          <p className="mt-4 text-lg text-gray-500">通过这个交互式3D地球仪探索我们的全球业务</p>
        </div>

        <div className="relative mx-auto flex h-[600px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Globe
          </span>
          <Globe className="top-28" />
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">拖动可旋转地球仪，或观看它自动旋转</p>
        </div>
      </div>
    </div>
  );
}
