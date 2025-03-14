'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface SkillNode {
  id: string;
  title: string;
  completed?: boolean;
  children?: SkillNode[];
}

export interface SkillCategory {
  id: string;
  title: string;
  nodes: SkillNode[];
}

export interface SkillRoadmapProps {
  categories: SkillCategory[];
  className?: string;
}

export function SkillRoadmap({ categories, className }: SkillRoadmapProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h3 className="text-2xl font-bold text-center py-2 border-b border-border">
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.nodes.map((node) => (
                <SkillNodeComponent key={node.id} node={node} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkillNodeProps {
  node: SkillNode;
}

function SkillNodeComponent({ node }: SkillNodeProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg border',
            node.completed ? 'bg-primary/10 border-primary/30' : 'bg-background border-border'
          )}
        >
          <CheckCircle2
            className={cn('h-5 w-5', node.completed ? 'text-primary' : 'text-gray-300')}
          />
          <span className="font-medium">{node.title}</span>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="absolute left-6 top-[calc(100%+2px)] bottom-0 w-0.5 bg-border h-4" />
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="pl-8 space-y-4">
          {node.children.map((child) => (
            <SkillNodeComponent key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SkillRoadmapConnected({ categories, className }: SkillRoadmapProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex flex-col md:flex-row gap-8 justify-center">
        {categories.map((category, categoryIndex) => (
          <div key={category.id} className="relative">
            <div className="sticky top-4 z-10 bg-background py-2 border-b border-border">
              <h3 className="text-2xl font-bold text-center">{category.title}</h3>
            </div>

            <div className="mt-4 space-y-4 relative">
              {category.nodes.map((node, nodeIndex) => (
                <div key={node.id} className="relative">
                  <div
                    className={cn(
                      'flex items-center justify-center p-3 rounded-lg border text-center',
                      'relative z-10 bg-background',
                      node.completed
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-background border-border'
                    )}
                  >
                    <span className="font-medium">{node.title}</span>
                    {node.completed && (
                      <CheckCircle2 className="h-5 w-5 text-primary absolute -right-2 -top-2" />
                    )}
                  </div>

                  {/* 连接线 - 垂直 */}
                  {nodeIndex < category.nodes.length - 1 && (
                    <div className="absolute left-1/2 top-[calc(100%-8px)] w-0.5 h-4 bg-blue-400 z-0" />
                  )}

                  {/* 连接线 - 水平 */}
                  {categoryIndex < categories.length - 1 && nodeIndex === 0 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-blue-400 z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
