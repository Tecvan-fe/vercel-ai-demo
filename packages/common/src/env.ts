import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../../.env'))) as {
  NODE_ENV: string;
  DATABASE_URL: string;
  ANTHROPIC_API_KEY: string;
  OPENAI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
};
