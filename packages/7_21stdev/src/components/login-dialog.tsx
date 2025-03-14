'use client';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useId } from 'react';
import { UserIcon } from 'lucide-react';

export function LoginDialog() {
  const id = useId();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          登录
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200"
            aria-hidden="true"
          >
            <UserIcon className="h-6 w-6 text-gray-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">欢迎回来</DialogTitle>
            <DialogDescription className="sm:text-center">
              请输入您的账号信息进行登录
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>邮箱</Label>
              <Input id={`${id}-email`} placeholder="your@email.com" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>密码</Label>
              <Input id={`${id}-password`} placeholder="请输入密码" type="password" required />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label htmlFor={`${id}-remember`} className="font-normal text-gray-500">
                记住我
              </Label>
            </div>
            <a className="text-sm underline hover:no-underline" href="#">
              忘记密码?
            </a>
          </div>
          <Button type="button" className="w-full">
            登录
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">
          <span className="text-xs text-gray-500">或</span>
        </div>

        <Button variant="outline">使用微信登录</Button>
      </DialogContent>
    </Dialog>
  );
}
