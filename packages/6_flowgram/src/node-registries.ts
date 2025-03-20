import { WorkflowNodeRegistry } from '@flowgram.ai/free-layout-editor';

/**
 * Custom node registries
 */
export const nodeRegistries: WorkflowNodeRegistry[] = [
  {
    type: 'start',
    meta: {
      isStart: true, // Mark as start node
      deleteDisable: true, // Start node cannot be deleted
      copyDisable: true, // Start node cannot be copied
      defaultPorts: [{ type: 'output' }], // Define input/output ports, start node only has output port
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
    defaultPorts: [{ type: 'output' }, { type: 'input' }], // Normal node has two ports
  },
];
