import axios from 'axios';
import { DataSource, HotTopic } from '../types';
import { logger } from '../services/logger';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'llm', 'gpt', 'chatgpt', 'openai', 'anthropic', 'claude',
  'transformer', 'neural network', 'nlp', 'computer vision',
  'generative ai', 'diffusion', 'stable diffusion', 'midjourney',
  'langchain', 'vector database', 'rag', 'fine-tuning', 'fine tuning',
  'reinforcement learning', 'agent', 'ai agent', 'copilot',
  'multimodal', 'embedding', 'tokenizer', 'inference',
];

interface HNItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  time?: number;
  type?: string;
  descendants?: number;
}

/**
 * Hacker News 数据源
 * 从 HN Top Stories 中筛选 AI 相关话题
 */
export class HackerNewsSource implements DataSource {
  name = 'Hacker News';

  async fetchTopics(): Promise<HotTopic[]> {
    try {
      logger.info('正在从 Hacker News 抓取热点...');

      // 获取 Top Stories IDs
      const { data: topIds } = await axios.get<number[]>(
        `${HN_API_BASE}/topstories.json`,
        { timeout: 10000 }
      );

      // 获取前100条的详情
      const top100Ids = topIds.slice(0, 100);
      const itemPromises = top100Ids.map(id =>
        axios.get<HNItem>(`${HN_API_BASE}/item/${id}.json`, { timeout: 10000 })
          .then(res => res.data)
          .catch(() => null)
      );

      const items = await Promise.all(itemPromises);

      // 筛选 AI 相关话题
      const aiTopics: HotTopic[] = [];

      for (const item of items) {
        if (!item || !item.title) continue;

        const titleLower = item.title.toLowerCase();
        const isAiRelated = AI_KEYWORDS.some(keyword =>
          titleLower.includes(keyword)
        );

        if (isAiRelated) {
          aiTopics.push({
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            source: this.name,
            score: item.score || 0,
            publishedAt: item.time
              ? new Date(item.time * 1000).toISOString()
              : undefined,
          });
        }
      }

      // 按热度排序
      aiTopics.sort((a, b) => b.score - a.score);

      logger.info(`从 Hacker News 获取到 ${aiTopics.length} 条 AI 相关热点`);
      return aiTopics;
    } catch (error) {
      logger.error(`Hacker News 数据抓取失败: ${error}`);
      return [];
    }
  }
}
