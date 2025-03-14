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
          ? 'bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800'
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
    return <div className={cn('w-0.5 h-8 bg-green-400 mx-auto', className)} />;
  }

  if (type === 'horizontal') {
    return <div className={cn('h-0.5 w-8 bg-green-400', className)} />;
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
        <path d="M20 0V20H40" stroke="#4ADE80" strokeWidth="2" />
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
        <path d="M20 0V20H0" stroke="#4ADE80" strokeWidth="2" />
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
        <path d="M20 0V40H40" stroke="#4ADE80" strokeWidth="2" />
        <path d="M20 40V80" stroke="#4ADE80" strokeWidth="2" />
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
        <path d="M20 0V40H0" stroke="#4ADE80" strokeWidth="2" />
        <path d="M20 40V80" stroke="#4ADE80" strokeWidth="2" />
      </svg>
    );
  }

  return null;
}

export function BackendRoadmap() {
  return (
    <div className="w-full overflow-x-auto pb-10">
      <div className="min-w-[1000px] p-8">
        <h2 className="text-3xl font-bold text-center mb-10">后端开发路线图</h2>

        <div className="flex flex-col items-center">
          {/* 主标题 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="后端开发" completed className="font-bold" />
            <RoadmapConnection type="vertical" />
          </div>

          {/* 互联网基础 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="互联网基础" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="HTTP/HTTPS" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="浏览器工作原理" completed />
              </div>

              <div className="flex flex-col items-center">
                <RoadmapConnection type="curve-right" className="-mb-4 -mr-4" />
                <RoadmapNode title="DNS工作原理" completed />
              </div>
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* 编程语言 */}
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <RoadmapNode title="编程语言" completed />
              <RoadmapConnection type="vertical" />

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <RoadmapNode title="JavaScript" completed />
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="Node.js" completed />
                </div>

                <div className="flex flex-col items-center">
                  <RoadmapNode title="Python" completed />
                  <RoadmapConnection type="vertical" />
                  <RoadmapNode title="Django/Flask" completed />
                </div>
              </div>
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* 数据库 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="数据库" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-2 gap-16">
              <div className="flex flex-col items-center">
                <RoadmapNode title="关系型数据库" completed />
                <RoadmapConnection type="vertical" />
                <div className="grid grid-cols-2 gap-4">
                  <RoadmapNode title="MySQL" completed />
                  <RoadmapNode title="PostgreSQL" completed />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <RoadmapNode title="NoSQL数据库" completed />
                <RoadmapConnection type="vertical" />
                <div className="grid grid-cols-2 gap-4">
                  <RoadmapNode title="MongoDB" completed />
                  <RoadmapNode title="Redis" completed />
                </div>
              </div>
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* API */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="API开发" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-3 gap-8">
              <RoadmapNode title="REST" completed />
              <RoadmapNode title="GraphQL" completed />
              <RoadmapNode title="gRPC" optional />
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* 认证 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="认证" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-3 gap-8">
              <RoadmapNode title="OAuth" completed />
              <RoadmapNode title="JWT" completed />
              <RoadmapNode title="基本认证" completed />
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* 测试 */}
          <div className="flex flex-col items-center">
            <RoadmapNode title="测试" completed />
            <RoadmapConnection type="vertical" />

            <div className="grid grid-cols-3 gap-8">
              <RoadmapNode title="单元测试" completed />
              <RoadmapNode title="集成测试" completed />
              <RoadmapNode title="功能测试" completed />
            </div>
          </div>

          <RoadmapConnection type="vertical" className="h-16" />

          {/* CI/CD */}
          <div className="flex items-center">
            <RoadmapNode title="CI/CD" completed />
            <RoadmapConnection type="horizontal" className="w-16 mx-8" />
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 gap-8">
                <RoadmapNode title="GitHub Actions" completed />
                <RoadmapNode title="Jenkins" completed />
                <RoadmapNode title="GitLab CI" completed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
