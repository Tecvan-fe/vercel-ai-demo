'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { useAnimate } from 'framer-motion';
import { Mail, Github, Linkedin, Download, ExternalLink } from 'lucide-react';

import { Button, buttonVariants } from './ui/button';
import { HighlighterItem, HighlightGroup, Particles } from './ui/highlighter';

export function ResumeProfile() {
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
        ['#frontend', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 50, top: 102 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#frontend', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#backend', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 224, top: 170 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#backend', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#design', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 88, top: 198 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#design', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#mobile', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 200, top: 60 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#mobile', { opacity: 0.5 }, { at: '-0.3', duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      }
    );
  }, [animate]);

  return (
    <section className="relative mx-auto mb-20 mt-6 max-w-5xl">
      <HighlightGroup className="group h-full">
        <div className="group/item h-full md:col-span-6 lg:col-span-12" data-aos="fade-down">
          <HighlighterItem className="rounded-3xl p-6">
            <div className="relative z-20 h-full overflow-hidden rounded-3xl border border-border bg-background dark:border-slate-800">
              <Particles
                className="absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100"
                quantity={200}
                color={'#555555'}
                vy={-0.2}
              />
              <div className="flex flex-col md:flex-row justify-center p-6 gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-border mb-4">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl font-bold text-foreground">
                      JD
                    </div>
                  </div>

                  <div
                    className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px]"
                    ref={scope}
                  >
                    <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2">
                      <span className="block h-3 w-3 rounded-full bg-primary animate-ping"></span>
                    </div>
                    <div
                      id="mobile"
                      className="absolute bottom-12 left-14 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      移动开发
                    </div>
                    <div
                      id="backend"
                      className="absolute left-2 top-20 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      后端开发
                    </div>
                    <div
                      id="design"
                      className="absolute bottom-20 right-1 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      UI/UX 设计
                    </div>
                    <div
                      id="frontend"
                      className="absolute right-12 top-10 rounded-3xl border border-border bg-background/80 px-2 py-1.5 text-xs opacity-50 dark:border-slate-600 dark:bg-slate-800"
                    >
                      前端开发
                    </div>

                    <div id="pointer" className="absolute">
                      <svg
                        width="16.8"
                        height="18.2"
                        viewBox="0 0 12 13"
                        className="fill-primary"
                        stroke="white"
                        strokeWidth="1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                        />
                      </svg>
                      <span className="bg-primary relative -top-1 left-3 rounded-3xl px-2 py-1 text-xs text-primary-foreground">
                        技能
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-2 md:w-[500px]">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">张三</h1>
                  <h2 className="text-xl md:text-2xl text-gray-500 mb-4">全栈开发工程师</h2>

                  <div className="space-y-4 mb-6">
                    <p className="text-foreground">
                      我是一名充满激情的全栈开发者，拥有5年的行业经验。专注于创建高性能、用户友好的应用程序，擅长前端和后端技术。
                    </p>
                    <p className="text-gray-500">
                      技术栈: React, Vue, Node.js, Python, AWS, Docker
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href="#contact">
                      <Button>联系我</Button>
                    </Link>
                    <Link
                      href="/resume.pdf"
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                        })
                      )}
                    >
                      <span className="flex items-center gap-1">
                        <Download strokeWidth={1.5} className="h-4 w-4 mr-1" />
                        下载简历
                      </span>
                    </Link>
                    <Link
                      href="https://github.com"
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'icon',
                        })
                      )}
                    >
                      <Github strokeWidth={1.5} className="h-4 w-4" />
                    </Link>
                    <Link
                      href="https://linkedin.com"
                      target="_blank"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'icon',
                        })
                      )}
                    >
                      <Linkedin strokeWidth={1.5} className="h-4 w-4" />
                    </Link>
                    <Link
                      href="mailto:example@example.com"
                      className={cn(
                        buttonVariants({
                          variant: 'outline',
                          size: 'icon',
                        })
                      )}
                    >
                      <Mail strokeWidth={1.5} className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-t border-border">
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-lg font-semibold mb-2">工作经验</h3>
                  <p className="text-gray-500">5+ 年专业经验</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-lg font-semibold mb-2">项目</h3>
                  <p className="text-gray-500">20+ 完成项目</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <h3 className="text-lg font-semibold mb-2">教育背景</h3>
                  <p className="text-gray-500">计算机科学硕士</p>
                </div>
              </div>
            </div>
          </HighlighterItem>
        </div>
      </HighlightGroup>
    </section>
  );
}
