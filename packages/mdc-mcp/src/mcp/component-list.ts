import { z } from 'zod';

import { BaseTool } from '../utils/base-tool';
import { type ComponentMeta } from '../types';
import { ComponentService } from '../services/component-service';
import { logger } from '../utils/logger';

const UI_TOOL_NAME = 'get_components_list';
const UI_TOOL_DESCRIPTION = `
"Use this tool when the user requests a new UI component—e.g., mentions /dc, /components, or asks for a button, input, dialog, table, form, banner, card, or other React component.
This tool ONLY returns available component list.
After calling this tool, you must edit or add files to integrate the snippet into the codebase."
`;

const format = (metas: ComponentMeta[]) => {
  const res: string[] = [
    'You are given a task to integrate an existing React component in the codebase.',
    'Here are the available components:',
    '',
  ];

  for (const meta of metas) {
    res.push(`- \`${meta.name}\` - ${meta.description}`);
  }
  return res.join('\n');
};

export class FetchComponentListTool extends BaseTool {
  name = UI_TOOL_NAME;
  description = UI_TOOL_DESCRIPTION;

  schema = z.object({});
  componentService: ComponentService;

  constructor(componentsDir: string) {
    super();
    this.componentService = new ComponentService(componentsDir);
  }

  async execute() {
    try {
      const components = await this.componentService.getComponentsList();

      return {
        content: [
          {
            type: 'text' as const,
            text: format(components),
          },
        ],
      };
    } catch (error) {
      logger.error('Error executing tool', error);
      throw error;
    }
  }
}
