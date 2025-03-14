'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const chatBubbleVariants = cva('flex gap-3 w-max max-w-[80%] md:max-w-[70%]', {
  variants: {
    variant: {
      sent: 'ml-auto',
      received: 'mr-auto',
    },
  },
  defaultVariants: {
    variant: 'received',
  },
});

export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(chatBubbleVariants({ variant }), className)} {...props} />;
  }
);
ChatBubble.displayName = 'ChatBubble';

const chatBubbleAvatarVariants = cva(
  'flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ChatBubbleAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleAvatarVariants> {
  src?: string;
  fallback: string;
}

const ChatBubbleAvatar = React.forwardRef<HTMLDivElement, ChatBubbleAvatarProps>(
  ({ className, size, src, fallback, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(chatBubbleAvatarVariants({ size }), className)} {...props}>
        {src ? (
          <img src={src} alt={fallback} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
    );
  }
);
ChatBubbleAvatar.displayName = 'ChatBubbleAvatar';

const chatBubbleMessageVariants = cva('rounded-lg px-4 py-2.5 text-sm', {
  variants: {
    variant: {
      sent: 'bg-primary text-primary-foreground',
      received: 'bg-muted',
    },
  },
  defaultVariants: {
    variant: 'received',
  },
});

export interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  ({ className, variant, isLoading, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(chatBubbleMessageVariants({ variant }), className)} {...props}>
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-current"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.2s]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.4s]"></span>
          </div>
        ) : (
          props.children
        )}
      </div>
    );
  }
);
ChatBubbleMessage.displayName = 'ChatBubbleMessage';

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage };
