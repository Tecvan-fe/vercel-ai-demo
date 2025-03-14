'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

const expandableChatVariants = cva(
  'fixed z-50 flex flex-col shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out bg-background border',
  {
    variants: {
      size: {
        sm: 'w-80 h-96',
        md: 'w-96 h-[32rem]',
        lg: 'w-[28rem] h-[36rem]',
      },
      position: {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
      },
      state: {
        expanded: 'translate-y-0 opacity-100',
        collapsed: 'translate-y-full opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'bottom-right',
      state: 'collapsed',
    },
  }
);

export interface ExpandableChatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof expandableChatVariants> {
  icon?: React.ReactNode;
}

const ExpandableChat = React.forwardRef<HTMLDivElement, ExpandableChatProps>(
  ({ className, size, position, icon, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
      <>
        <Button
          variant="default"
          size="icon"
          className={cn(
            'fixed z-50 rounded-full h-14 w-14 shadow-lg',
            position === 'bottom-right' && 'bottom-4 right-4',
            position === 'bottom-left' && 'bottom-4 left-4',
            position === 'top-right' && 'top-4 right-4',
            position === 'top-left' && 'top-4 left-4'
          )}
          onClick={() => setIsExpanded(true)}
        >
          {icon || <span className="text-xl">💬</span>}
        </Button>

        <div
          ref={ref}
          className={cn(
            expandableChatVariants({
              size,
              position,
              state: isExpanded ? 'expanded' : 'collapsed',
            }),
            className
          )}
          {...props}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          {props.children}
        </div>
      </>
    );
  }
);
ExpandableChat.displayName = 'ExpandableChat';

const ExpandableChatHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex items-center p-4 border-b', className)} {...props} />;
  }
);
ExpandableChatHeader.displayName = 'ExpandableChatHeader';

const ExpandableChatBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex-1 overflow-hidden', className)} {...props} />;
  }
);
ExpandableChatBody.displayName = 'ExpandableChatBody';

const ExpandableChatFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-4 border-t', className)} {...props} />;
  }
);
ExpandableChatFooter.displayName = 'ExpandableChatFooter';

export { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter };
