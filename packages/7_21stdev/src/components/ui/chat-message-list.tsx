'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, ...props }, ref) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [props.children]);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-4 overflow-y-auto p-4', className)}
        {...props}
      >
        {props.children}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';

export { ChatMessageList };
