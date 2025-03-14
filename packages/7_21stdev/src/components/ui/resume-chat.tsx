'use client';

import React, { useState, FormEvent } from 'react';
import { Bot, Send, Paperclip, Mic, CornerDownLeft, MessageCircle, Briefcase } from 'lucide-react';
import { Button } from './button';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from './chat-bubble';
import { ChatInput } from './chat-input';
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from './expandable-chat';
import { ChatMessageList } from './chat-message-list';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}

export function ResumeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: '你好！我是简历助手，可以回答关于我的技能、工作经验和项目的问题。',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 模拟API调用，根据用户问题生成相关回答
      setTimeout(() => {
        let response = '';
        const userQuestion = input.toLowerCase();

        if (userQuestion.includes('技能') || userQuestion.includes('会什么')) {
          response =
            '我的主要技能包括：\n\n**前端开发**：\n- React、Vue.js、Next.js\n- TypeScript、JavaScript\n- HTML5、CSS3、Tailwind CSS\n\n**后端开发**：\n- Node.js、Express\n- Python、Django\n- 数据库：MongoDB、MySQL、PostgreSQL\n\n**其他技能**：\n- Git版本控制\n- Docker容器化\n- AWS云服务\n- CI/CD自动化部署';
        } else if (userQuestion.includes('工作经验') || userQuestion.includes('工作经历')) {
          response =
            '我的工作经验：\n\n**高级全栈开发工程师** | 科技公司 | 2020年至今\n- 负责公司核心产品的前端和后端开发\n- 使用React、Node.js和AWS技术栈构建可扩展的应用程序\n- 优化用户体验和系统性能\n\n**前端开发工程师** | 互联网公司 | 2018年-2020年\n- 负责公司网站和Web应用程序的前端开发\n- 使用Vue.js和相关技术栈构建用户界面\n- 实现响应式设计和交互功能';
        } else if (userQuestion.includes('项目') || userQuestion.includes('作品')) {
          response =
            '我的主要项目：\n\n**企业管理系统**\n- 开发了一个全功能的企业资源管理系统\n- 包括客户关系管理、库存管理和财务报表功能\n- 技术栈：React、Node.js、MongoDB\n\n**电子商务平台**\n- 构建了一个现代化的电子商务平台\n- 支持产品展示、购物车、支付集成和订单管理功能\n- 技术栈：Vue.js、Express、PostgreSQL';
        } else if (userQuestion.includes('教育') || userQuestion.includes('学历')) {
          response =
            '我的教育背景：\n\n**计算机科学硕士** | 知名大学 | 2016年-2018年\n- 专注于软件工程和人工智能领域\n- 参与了多个研究项目，并发表了相关学术论文\n\n**计算机科学学士** | 知名大学 | 2012年-2016年\n- 学习了计算机科学的基础知识和核心技能\n- 包括算法、数据结构、操作系统和软件开发方法论';
        } else if (
          userQuestion.includes('联系') ||
          userQuestion.includes('邮箱') ||
          userQuestion.includes('电话')
        ) {
          response =
            '您可以通过以下方式联系我：\n\n- 邮箱：example@example.com\n- GitHub：github.com/username\n- LinkedIn：linkedin.com/in/username\n\n或者通过简历页面的联系表单发送消息给我。';
        } else {
          response =
            '作为简历助手，我可以回答关于我的技能、工作经验、项目和教育背景的问题。请问您想了解哪方面的信息？';
        }

        const aiResponse: Message = {
          id: messages.length + 2,
          content: response,
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('获取响应时出错:', error);
      setIsLoading(false);
    }
  };

  return (
    <ExpandableChat size="lg" position="bottom-right" icon={<Briefcase className="h-6 w-6" />}>
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">简历助手</h1>
        <p className="text-sm text-gray-500">询问我关于技能、工作经验和项目的问题</p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble key={message.id} variant={message.sender === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={message.sender === 'user' ? undefined : undefined}
                fallback={message.sender === 'user' ? '我' : '助手'}
              />
              <ChatBubbleMessage variant={message.sender === 'user' ? 'sent' : 'received'}>
                {message.sender === 'ai' ? (
                  <div className="markdown-content text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar className="h-8 w-8 shrink-0" fallback="助手" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-primary p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="询问关于我的技能、经验或项目..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setInput('你有哪些技能？')}
              >
                <span className="text-xs">技能</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setInput('介绍一下你的工作经验')}
              >
                <span className="text-xs">经验</span>
              </Button>
            </div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              发送
              <CornerDownLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
