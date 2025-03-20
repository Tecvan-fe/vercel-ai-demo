import React, { useEffect, useState } from 'react';
import { usePlaygroundTools, useClientContext } from '@flowgram.ai/free-layout-editor';

export const Tools: React.FC = () => {
  const { history } = useClientContext();
  const tools = usePlaygroundTools();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const disposable = history.undoRedoService.onChange(() => {
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    });
    return () => disposable.dispose();
  }, [history]);

  return (
    <div
      style={{ position: 'absolute', zIndex: 10, bottom: 16, left: 226, display: 'flex', gap: 8 }}
    >
      <button onClick={() => tools.zoomin()}>放大</button>
      <button onClick={() => tools.zoomout()}>缩小</button>
      <button onClick={() => tools.fitView()}>适应视图</button>
      <button onClick={() => tools.autoLayout()}>自动布局</button>
      <button onClick={() => history.undo()} disabled={!canUndo}>
        撤销
      </button>
      <button onClick={() => history.redo()} disabled={!canRedo}>
        重做
      </button>
      <span>{Math.floor(tools.zoom * 100)}%</span>
    </div>
  );
};
