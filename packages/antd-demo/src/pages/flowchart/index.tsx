import React from 'react';
import Editor from './Editor';
import '@flowgram.ai/free-layout-editor/index.css';
import './index.css';

const FlowchartPage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor />
    </div>
  );
};

export default FlowchartPage;
