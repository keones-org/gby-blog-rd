import axios from 'axios';
import * as cheerio from 'cheerio';
import { DataSource, HotTopic } from '../types';
import { logger } from '../services/logger';

const GITHUB_TRENDING_URL = 'https://github.com/trending';

const AI_KEYWORDS = [
  'ai', 'artificial-intelligence', 'machine-learning', 'deep-learning',
  'llm', 'gpt', 'chatgpt', 'openai', 'transformer', 'neural',
  'nlp', 'computer-vision', 'generative', 'diffusion', 'langchain',
  'vector', 'rag', 'embedding', 'agent', 'copilot', 'multimodal',
  'huggingface', 'pytorch', 'tensorflow', 'model', 'inference',
  'fine-tune', 'finetune', 'lora', 'qlora', 'stable-diffusion',
];

/**
 * GitHub Trending 数据源
 * 从 GitHub Trending 中筛选 AI 相关项目
 */
export class GitHubTrendingSource implements DataSource {
  name = 'GitHub Trending';

  async fetchTopics(): Promise<HotTopic[]> {
    try {
      logger.info('正在从 GitHub Trending 抓取热点...');

      const { data: html } = await axios.get<string>(GITHUB_TRENDING_URL, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AI-Topic-Analyzer/1.0)',
          'Accept': 'text/html',
        },
      });

      const $ = cheerio.load(html);
      const topics: HotTopic[] = [];

      $('article.Box-row').each((_index, element) => {
        const $el = $(element);

        const repoPath = $el.find('h2 a').attr('href')?.trim() || '';
        const repoName = repoPath.replace(/^\//, '');
        const description = $el.find('p').text().trim();
        const starsText = $el.find('.d-inline-block.float-sm-right').text().trim()
          || $el.find('[class*="star"]').last().text().trim();
        const stars = parseInt(starsText.replace(/[^0-9]/g, ''), 10) || 0;

        const fullText = `${repoName} ${description}`.toLowerCase();
        const isAiRelated = AI_KEYWORDS.some(keyword =>
          fullText.includes(keyword)
        );

        if (isAiRelated && repoName) {
          topics.push({
            title: repoName,
            url: `https://github.com${repoPath}`,
            source: this.name,
            score: stars,
            summary: description || undefined,
            tags: ['github', 'open-source'],
          });
        }
      });

      // 按 stars 排序
      topics.sort((a, b) => b.score - a.score);

      logger.info(`从 GitHub Trending 获取到 ${topics.length} 条 AI 相关项目`);
      return topics;
    } catch (error) {
      logger.error(`GitHub Trending 数据抓取失败: ${error}`);
      return [];
    }
  }
}
