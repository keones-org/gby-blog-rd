import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataSource, HotTopic } from '../types';
import { logger } from '../services/logger';

const TECHCRUNCH_AI_URL = 'https://techcrunch.com/category/artificial-intelligence/';

/**
 * TechCrunch AI 栏目数据源
 * 抓取 TechCrunch 的 AI 分类下的最新文章
 */
export class TechCrunchSource implements DataSource {
  name = 'TechCrunch';

  async fetchTopics(): Promise<HotTopic[]> {
    try {
      logger.info('正在从 TechCrunch 抓取 AI 新闻...');

      const { data: html } = await axios.get<string>(TECHCRUNCH_AI_URL, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI-Topic-Analyzer/1.0)',
          'Accept': 'text/html',
        },
      });

      const $ = cheerio.load(html);
      const topics: HotTopic[] = [];

      // TechCrunch 文章列表选择器
      $('article, .post-block').each((_index, element) => {
        const $el = $(element);

        const $link = $el.find('a[href*="techcrunch.com"]').first()
          || $el.find('h2 a, h3 a').first();

        const title = $el.find('h2, h3').first().text().trim();
        const url = $link.attr('href') || '';
        const summary = $el.find('.post-block__content, p').first().text().trim();
        const timeStr = $el.find('time').attr('datetime') || '';

        if (title && url) {
          topics.push({
            title,
            url,
            source: this.name,
            score: 0,
            summary: summary || undefined,
            publishedAt: timeStr || undefined,
            tags: ['news', 'tech'],
          });
        }
      });

      // 限制最多20条
      const limitedTopics = topics.slice(0, 20);

      logger.info(`从 TechCrunch 获取到 ${limitedTopics.length} 条 AI 新闻`);
      return limitedTopics;
    } catch (error) {
      logger.error(`TechCrunch 数据抓取失败: ${error}`);
      return [];
    }
  }
}
