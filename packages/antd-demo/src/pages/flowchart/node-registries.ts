import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

/**
 * 自定义节点注册表
 */
export const nodeRegistries: WorkflowNodeRegistry[] = [
  {
    type: 'start',
    meta: {
      isStart: true, // 标记为起始节点
      deleteDisable: true, // 起始节点不能删除
      copyDisable: true, // 起始节点不能复制
      defaultPorts: [{ type: 'output' }], // 定义输入/输出端口，起始节点只有输出端口
    },
  },
  {
    type: 'end',
    meta: {
      deleteDisable: true,
      copyDisable: true,
      defaultPorts: [{ type: 'input' }],
    },
  },
  {
    type: 'custom',
    meta: {},
    defaultPorts: [{ type: 'output' }, { type: 'input' }], // 普通节点有两个端口
  },
];
