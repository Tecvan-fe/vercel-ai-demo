'use client';

import React, { useState, FormEvent, useRef } from 'react';
import { Bot, Send, Paperclip, Mic, CornerDownLeft, MessageCircle } from 'lucide-react';
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

export function TabbarChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
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
      // 模拟API调用到LLM
      // 在实际应用中，替换为对LLM服务的实际API调用
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          content:
            "这是一个支持**Markdown**的回复：\n\n```javascript\nconsole.log('你好，世界！');\n```\n\n- 列表项1\n- 列表项2\n\n[链接示例](https://example.com)",
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

  const handleAttachFile = () => {
    // 实现文件附件逻辑
  };

  const handleMicrophoneClick = () => {
    // 实现语音输入逻辑
  };

  return (
    <ExpandableChat size="lg" position="bottom-right" icon={<MessageCircle className="h-6 w-6" />}>
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold">AI 助手</h1>
        <p className="text-sm text-gray-500">有任何问题都可以向我提问</p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble key={message.id} variant={message.sender === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === 'user'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop'
                    : undefined
                }
                fallback={message.sender === 'user' ? '用户' : 'AI'}
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
              <ChatBubbleAvatar className="h-8 w-8 shrink-0" fallback="AI" />
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
            placeholder="输入您的问题..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button variant="ghost" size="icon" type="button" onClick={handleAttachFile}>
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" type="button" onClick={handleMicrophoneClick}>
                <Mic className="h-4 w-4" />
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
