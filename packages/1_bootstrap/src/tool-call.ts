import { generateText, tool, type CoreMessage } from 'ai';
import { z } from 'zod';
import { createAnthropicModel } from '@demo/common';

// 定义天气工具的返回类型
interface WeatherInfo {
  temperature: number;
  condition: string;
  city: string;
}

// 模拟天气 API
async function getWeather(city: string): Promise<WeatherInfo> {
  // 这里模拟 API 调用
  return {
    temperature: Math.floor(Math.random() * 30) + 10,
    condition: ['晴朗', '多云', '下雨', '阴天'][Math.floor(Math.random() * 4)],
    city,
  };
}

// 创建路由处理函数
async function handleChatRequest(messages: CoreMessage[]) {
  const result = await generateText({
    model: createAnthropicModel(),
    messages,
    maxSteps: 5,
    // 定义工具
    tools: {
      getWeatherInfo: tool({
        // 工具描述
        description: '获取指定城市的天气信息',
        // 参数定义
        parameters: z.object({
          city: z.string().describe('要查询天气的城市名称'),
        }),
        // 执行函数
        execute: async ({ city }) => {
          const weather = await getWeather(city);
          return `${city}的天气是${weather.condition}，温度${weather.temperature}°C`;
        },
      }),
    },
  });

  return result.text;
}

const main = async () => {
  const result = await handleChatRequest([{ role: 'user', content: '北京天气怎么样？' }]);
  process.stdout.write(result);
};

main();
