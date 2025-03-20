import React from 'react';
import { WorkflowDragService, useService } from '@flowgram.ai/free-layout-editor';

const cardkeys = ['节点1', '节点2'];

export const NodeAddPanel: React.FC = () => {
  const startDragSerivce = useService<WorkflowDragService>(WorkflowDragService);

  return (
    <div className="demo-free-sidebar">
      {cardkeys.map((nodeType) => (
        <div
          key={nodeType}
          className="demo-free-card"
          onMouseDown={(e) =>
            startDragSerivce.startDragCard('custom', e, {
              data: {
                title: `新${nodeType}`,
                content: '节点内容',
              },
            })
          }
        >
          {nodeType}
        </div>
      ))}
    </div>
  );
};
