'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface RoadmapNodeProps {
  title: string;
  completed?: boolean;
  recommended?: boolean;
  optional?: boolean;
  href?: string;
  className?: string;
}

function RoadmapNode({
  title,
  completed = false,
  recommended = false,
  optional = false,
  href,
  className,
}: RoadmapNodeProps) {
  const content = (
    <div
      className={cn(
        'relative flex items-center justify-center p-3 rounded-lg border text-center transition-all',
        'min-w-[150px] max-w-[200px]',
        completed
          ? 'bg-yellow-100 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-800'
          : 'bg-background border-border',
        recommended ? 'bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800' : '',
        optional ? 'bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-700' : '',
        className
      )}
    >
      <span className="font-medium text-sm">{title}</span>
      {completed && (
        <CheckCircle className="h-4 w-4 text-green-500 absolute -right-1 -top-1 bg-white dark:bg-gray-950 rounded-full" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

interface RoadmapConnectionProps {
  type: 'vertical' | 'horizontal' | 'curve-right' | 'curve-left' | 'branch-right' | 'branch-left';
  className?: string;
}

function RoadmapConnection({ type, className }: RoadmapConnectionProps) {
  if (type === 'vertical') {
    return <div className={cn('w-0.5 h-8 bg-blue-400 mx-auto', className)} />;
  }

  if (type === 'horizontal') {
    return <div className={cn('h-0.5 w-8 bg-blue-400', className)} />;
  }

  if (type === 'curve-right') {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M20 0V20H40" stroke="#60A5FA" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'curve-left') {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M20 0V20H0" stroke="#60A5FA" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'branch-right') {
    return (
      <svg
        width="40"
        height="80"
        viewBox="0 0 40 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M20 0V40H40" stroke="#60A5FA" strokeWidth="2" />
        <path d="M20 40V80" stroke="#60A5FA" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'branch-left') {
    return (
      <svg
        width="40"
        height="80"
        viewBox="0 0 40 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M20 0V40H0" stroke="#60A5FA" strokeWidth="2" />
        <path d="M20 40V80" stroke="#60A5FA" strokeWidth="2" />
      </svg>
    );
  }

  return null;
}

export function FrontendRoadmap() {
  return (
    <div className="w-full overflow-x-auto pb-10">
      <div className="min-w-[1000px] p-8">
        <h2 className="text-3xl font-bold text-center mb-10">前端开发路线图</h2>

        <div className="flex flex-col items-center">
          {/* 主标题 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="前端开发" completed className="font-bold" />
            <RoadmapConnection type="vertical" />
          </div>

          {/* 互联网基础 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="互联网" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="互联网如何工作" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="什么是HTTP" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="什么是域名" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="什么是托管" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="DNS和工作原理" completed />
              </div>
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* HTML */}
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <RoadmapNode title="HTML" completed />
              <RoadmapConnection type="vertical" />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col items-center">
                  <RoadmapNode title="学习基础知识" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="语义化HTML" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="表单和验证" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="无障碍" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="SEO基础" completed />
                </div>
              </div>
            </div>

            <RoadmapConnection type="horizontal" className="w-16 mx-8" />

            {/* CSS */}
            <div className="flex flex-col items-center">
              <RoadmapNode title="CSS" completed />
              <RoadmapConnection type="vertical" />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col items-center">
                  <RoadmapNode title="学习基础知识" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="布局制作" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="响应式设计" completed />
                </div>
              </div>
            </div>

            <RoadmapConnection type="horizontal" className="w-16 mx-8" />

            {/* JavaScript */}
            <div className="flex flex-col items-center">
              <RoadmapNode title="JavaScript" completed />
              <RoadmapConnection type="vertical" />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col items-center">
                  <RoadmapNode title="学习基础知识" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="DOM操作" completed />
                </div>
              </div>
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* 版本控制系统 */}
          <div className="flex items-center">
            <RoadmapNode title="版本控制系统" completed />
            <RoadmapConnection type="horizontal" className="w-16 mx-8" />
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 gap-8">
                <RoadmapNode title="GitHub" completed />
                <RoadmapNode title="GitLab" completed />
                <RoadmapNode title="Bitbucket" optional />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
