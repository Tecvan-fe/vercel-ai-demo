import { Command } from 'commander';
import { startChat } from '../lib/chat';

export const startCommand = new Command('start')
  .description('启动交互式问答服务')
  .action(startChat);
