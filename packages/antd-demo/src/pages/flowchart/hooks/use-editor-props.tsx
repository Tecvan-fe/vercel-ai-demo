import { useMemo } from 'react';

import { createMinimapPlugin } from '@flowgram.ai/minimap-plugin';
import { createFreeSnapPlugin } from '@flowgram.ai/free-snap-plugin';
import {
  FreeLayoutProps,
  WorkflowNodeProps,
  WorkflowNodeRenderer,
  Field,
  useNodeRender,
} from '@flowgram.ai/free-layout-editor';

import { nodeRegistries } from '../node-registries';
import { initialData } from '../initial-data';

export const useEditorProps = () =>
  useMemo<FreeLayoutProps>(
    () => ({
      // 启用背景
      background: true,
      // 只读模式（节点不能拖动）
      readonly: false,
      // 初始数据
      initialData,
      // 节点注册表
      nodeRegistries,
      // 获取默认节点注册表，将与nodeRegistries合并
      getNodeDefaultRegistry(type) {
        return {
          type,
          meta: {
            defaultExpanded: true,
          },
          formMeta: {
            // 渲染表单
            render: () => (
              <>
                <Field<string> name="title">
                  {({ field }) => <div className="demo-free-node-title">{field.value}</div>}
                </Field>
                <div className="demo-free-node-content">
                  <Field<string> name="content">
                    <input />
                  </Field>
                </div>
              </>
            ),
          },
        };
      },
      materials: {
        // 渲染节点
        renderDefaultNode: (props: WorkflowNodeProps) => {
          const { form } = useNodeRender();
          return (
            <WorkflowNodeRenderer className="demo-free-node" node={props.node}>
              {form?.render()}
            </WorkflowNodeRenderer>
          );
        },
      },
      // 内容变更事件
      onContentChange(ctx, event) {
        // 可以在这里添加自动保存逻辑
        // console.log('Auto Save: ', event, ctx.document.toJSON());
      },
      // 节点引擎配置，可以在FlowNodeRegistry中配置formMeta
      nodeEngine: {
        enable: true,
      },
      // 撤销/重做功能
      history: {
        enable: true,
        enableChangeNode: true, // 监听节点引擎数据变更
      },
      // 初始化
      onInit: (ctx) => {},
      // 画布渲染
      onAllLayersRendered(ctx) {
        // 自动适应视图
        ctx.document.fitView(false);
      },
      // 组件销毁
      onDispose() {
        console.log('---- Playground Dispose ----');
      },
      plugins: () => [
        // 小地图插件
        createMinimapPlugin({
          disableLayer: true,
          canvasStyle: {
            canvasWidth: 182,
            canvasHeight: 102,
            canvasPadding: 50,
            canvasBackground: 'rgba(245, 245, 245, 1)',
            canvasBorderRadius: 10,
            viewportBackground: 'rgba(235, 235, 235, 1)',
            viewportBorderRadius: 4,
            viewportBorderColor: 'rgba(201, 201, 201, 1)',
            viewportBorderWidth: 1,
            viewportBorderDashLength: 2,
            nodeColor: 'rgba(255, 255, 255, 1)',
            nodeBorderRadius: 2,
            nodeBorderWidth: 0.145,
            nodeBorderColor: 'rgba(6, 7, 9, 0.10)',
            overlayColor: 'rgba(255, 255, 255, 0)',
          },
          inactiveDebounceTime: 1,
        }),
        // 自动对齐和辅助线插件
        createFreeSnapPlugin({
          edgeColor: '#00B2B2',
          alignColor: '#00B2B2',
          edgeLineWidth: 1,
          alignLineWidth: 1,
          alignCrossWidth: 8,
        }),
      ],
    }),
    []
  );
