import { DataSource, HotTopic } from '../types';
import { HackerNewsSource, GitHubTrendingSource, TechCrunchSource } from '../sources';
import { logger } from './logger';

/**
 * 热点话题抓取器
 * 从多个数据源聚合 AI 相关热点
 */
export class TopicFetcher {
  private sources: DataSource[];

  constructor() {
    this.sources = [
      new HackerNewsSource(),
      new GitHubTrendingSource(),
      new TechCrunchSource(),
    ];
  }

  /**
   * 从所有数据源抓取话题
   */
  async fetchAll(): Promise<HotTopic[]> {
    logger.info(`开始从 ${this.sources.length} 个数据源抓取 AI 热点...`);

    const results = await Promise.allSettled(
      this.sources.map(source => source.fetchTopics())
    );

    const allTopics: HotTopic[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allTopics.push(...result.value);
        logger.info(`${this.sources[index].name}: 获取 ${result.value.length} 条`);
      } else {
        logger.error(`${this.sources[index].name}: 抓取失败 - ${result.reason}`);
      }
    });

    // 去重（基于URL）
    const seen = new Set<string>();
    const uniqueTopics = allTopics.filter(topic => {
      if (seen.has(topic.url)) return false;
      seen.add(topic.url);
      return true;
    });

    // 按热度排序
    uniqueTopics.sort((a, b) => b.score - a.score);

    logger.info(`共获取到 ${uniqueTopics.length} 条不重复的 AI 热点`);
    return uniqueTopics;
  }
}
