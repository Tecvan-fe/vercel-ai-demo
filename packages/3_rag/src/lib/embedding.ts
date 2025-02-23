import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';

// 将文档分成小块
export function splitIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  // 按句子分割
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// 为文本块生成向量嵌入
export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  const embeddingModel = openai.embedding('text-embedding-3-small');
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings;
}
