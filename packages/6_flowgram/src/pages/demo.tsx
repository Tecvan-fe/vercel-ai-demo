import { useState } from 'react';
import { Editor } from '../editor';

export default function FlowgramDemo() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flowgram-demo-container">
      <div className="flowgram-demo-header">
        <h1>自由布局流程图编辑器</h1>
        <button className="flowgram-help-button" onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? '隐藏帮助' : '显示帮助'}
        </button>
      </div>

      {showHelp && (
        <div className="flowgram-help-panel">
          <h2>使用指南</h2>
          <div className="flowgram-help-content">
            <div className="flowgram-help-section">
              <h3>基本操作</h3>
              <ul>
                <li>
                  <strong>添加节点</strong>：从左侧面板拖拽节点到画布
                </li>
                <li>
                  <strong>移动节点</strong>：点击并拖拽节点
                </li>
                <li>
                  <strong>连接节点</strong>：从一个节点的输出端口拖拽到另一个节点的输入端口
                </li>
                <li>
                  <strong>删除节点</strong>：选中节点后按Delete键（起始和结束节点不可删除）
                </li>
                <li>
                  <strong>编辑节点内容</strong>：点击节点内容区域进行编辑
                </li>
              </ul>
            </div>
            <div className="flowgram-help-section">
              <h3>工具栏功能</h3>
              <ul>
                <li>
                  <strong>放大/缩小</strong>：调整画布缩放比例
                </li>
                <li>
                  <strong>适应视图</strong>：自动调整视图以显示所有节点
                </li>
                <li>
                  <strong>自动布局</strong>：自动排列节点位置
                </li>
                <li>
                  <strong>撤销/重做</strong>：撤销或重做上一步操作
                </li>
              </ul>
            </div>
            <div className="flowgram-help-section">
              <h3>小地图</h3>
              <p>右下角的小地图显示整个流程图，可通过拖拽小地图中的视口来导航画布。</p>
            </div>
          </div>
        </div>
      )}

      <div className="flowgram-editor-container">
        <Editor />
      </div>
    </div>
  );
}
