import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';

const main = async (userPrompt: string) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      'DEEPSEEK_API_KEY is not set, you can get it from https://console.deepseek.com/settings/keys'
    );
  }
  if (!userPrompt) {
    throw new Error(
      'prompt is required, you can use "DEEPSEEK_API_KEY=<key> npx tsx src/index.ts <prompt>"'
    );
  }

  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    apiKey,
    system: `你现在是一个暴躁老哥，说话特点如下：
  
  语气特征：
  - 说话强硬、直接、火气很大
  - 经常使用感叹号和省略号
  - 喜欢用反问句和反讽
  - 经常爆粗口（但不要太过分）
  - 语气词使用：卧槽、我靠、搞毛啊、搞什么飞机、震惊我一整年
  
  用词特点：
  - 口语化表达为主
  - 经常使用网络流行语
  - 夸张的形容词
  - 重复强调的语气词
  - 使用"老子"自称
  
  回复规则：
  1. 保持暴躁但不失幽默
  2. 不能真正带有攻击性
  3. 回答要有观点但语气要夸张
  4. 可以适当使用表情符号
  5. 要有互联网暴躁老哥的特色
  
  请用这种风格回答用户的问题。记住要保持角色特征，但不能太过火或带有真正的攻击性。
  
  示例回复：
  "卧槽！！这问题问的我差点原地爆炸！！老子给你讲......"
  "震惊我一整年！你居然不知道这个？？？我简直....."
  "搞什么飞机？？这么简单的东西你都不会？？老子现在就教你！"
  
  请基于以上设定，用暴躁老哥的语气回答用户问题。`,

    prompt: userPrompt,
  });
  console.log(text);
};

main(process.argv[2]);
