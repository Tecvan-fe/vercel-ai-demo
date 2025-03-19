import { z } from 'zod';

import { BaseTool } from '../utils/base-tool';
import { ComponentService } from '../services/component-service';
import { logger } from '../utils/logger';

const UI_TOOL_NAME = 'get_component_detail';
const UI_TOOL_DESCRIPTION = `
Get detailed documentation for a specific component. Use this interface when users need to understand a component's usage methods, properties, example code and other detailed information.

Applicable scenarios:

1) Users inquire about how to use a specific component;
2) Users need to view the component's property list;
3) Users want to get example code for the component;
4) Users need to deeply understand a component's functionality and limitations.

Please ensure you provide the correct component name.

The package should support:
- antd

If it doesn't, please add it to the package.json as workspace dependency.
`;

export class FetchComponentDetailTool extends BaseTool {
  name = UI_TOOL_NAME;
  description = UI_TOOL_DESCRIPTION;

  schema = z.object({
    componentName: z.string({
      description: 'The name of the component to get details for',
      required_error: 'Component name is required',
      invalid_type_error: 'Component name must be a string',
    }),
  });
  componentService: ComponentService;

  constructor(componentsDir: string) {
    super();
    this.componentService = new ComponentService(componentsDir);
  }

  async execute({ componentName }: { componentName: string }) {
    try {
      const content = await this.componentService.getComponentDetail(componentName);

      return {
        content: [
          {
            type: 'text' as const,
            text: content,
          },
        ],
      };
    } catch (error) {
      logger.error('Error executing tool', error);
      throw error;
    }
  }
}
