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
      // Enable background
      background: true,
      // Readonly mode (nodes cannot be dragged)
      readonly: false,
      // Initial data
      initialData,
      // Node registries
      nodeRegistries,
      // Get default node registry, will be merged with nodeRegistries
      getNodeDefaultRegistry(type) {
        return {
          type,
          meta: {
            defaultExpanded: true,
          },
          formMeta: {
            // Render form
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
        // Render node
        renderDefaultNode: (props: WorkflowNodeProps) => {
          const { form } = useNodeRender();
          return (
            <WorkflowNodeRenderer className="demo-free-node" node={props.node}>
              {form?.render()}
            </WorkflowNodeRenderer>
          );
        },
      },
      // Content change event
      onContentChange(ctx, event) {
        // You can add auto-save logic here
        // console.log('Auto Save: ', event, ctx.document.toJSON());
      },
      // Node engine configuration, can configure formMeta in FlowNodeRegistry
      nodeEngine: {
        enable: true,
      },
      // Undo/redo functionality
      history: {
        enable: true,
        enableChangeNode: true, // Listen to node engine data changes
      },
      // Initialization
      onInit: (ctx) => {},
      // Canvas rendering
      onAllLayersRendered(ctx) {
        // Auto-fit view
        ctx.document.fitView(false);
      },
      // Component disposal
      onDispose() {
        console.log('---- Playground Dispose ----');
      },
      plugins: () => [
        // Minimap plugin
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
        // Auto-alignment and guide line plugin
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
