import { db } from '../db';
import { embeddings } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const embeddingModel = openai.embedding('text-embedding-3-small');

// 生成查询向量
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

// 在向量数据库中搜索相似内容
export async function searchSimilarContent(
  query: string,
  similarityThreshold: number = 0.5,
  limit: number = 5
) {
  // 生成查询向量
  const queryEmbedding = await generateEmbedding(query);

  // 计算余弦相似度并查询
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, queryEmbedding)})`;

  // 查询相似度高于阈值的内容
  const results = await db
    .select({
      content: embeddings.content,
      similarity,
    })
    .from(embeddings)
    .where(gt(similarity, similarityThreshold))
    .orderBy(desc(similarity))
    .limit(limit);

  return results;
}
