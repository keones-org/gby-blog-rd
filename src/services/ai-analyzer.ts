import OpenAI from 'openai';
import { HotTopic, AnalysisReport, TopicCategory } from '../types';
import { AppConfig } from '../types';
import { logger } from './logger';

/**
 * AI 分析服务
 * 使用 OpenAI API 对热点话题进行分析和总结
 */
export class AIAnalyzer {
  private client: OpenAI;
  private model: string;

  constructor(config: AppConfig) {
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseUrl,
    });
    this.model = config.openaiModel;
  }

  /**
   * 分析热点话题并生成报告
   */
  async analyze(topics: HotTopic[]): Promise<AnalysisReport> {
    logger.info(`开始使用 AI 分析 ${topics.length} 条热点话题...`);

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    if (topics.length === 0) {
      return this.createEmptyReport(dateStr);
    }

    // 构建分析提示词
    const topicsText = topics
      .slice(0, 50) // 限制最多50条避免超出token限制
      .map((t, i) => `${i + 1}. [${t.source}] ${t.title} (热度: ${t.score})${t.summary ? `\n   摘要: ${t.summary}` : ''}\n   链接: ${t.url}`)
      .join('\n');

    const prompt = `你是一位资深的AI行业分析师。以下是今天(${dateStr})从多个平台收集的AI领域热点话题列表:

${topicsText}

请对这些热点进行深度分析，生成一份专业的中文日报。要求：

1. **总体概述**：用2-3段话概括今天AI领域的整体动态和重要趋势
2. **话题分类**：将热点分为3-5个类别（如：大模型进展、AI应用落地、开源项目、行业动态、研究突破等），每个类别包含：
   - 类别名称
   - 类别简要描述（1-2句话）
   - 该类别下的重要话题列表（保留原始标题和链接）
3. **趋势分析**：分析当前AI领域的主要趋势和值得关注的方向

请以JSON格式返回，结构如下：
{
  "overview": "总体概述文本",
  "categories": [
    {
      "name": "类别名称",
      "description": "类别描述",
      "topics": [{"title": "话题标题", "url": "链接", "source": "来源", "score": 热度数字}]
    }
  ],
  "trendAnalysis": "趋势分析文本"
}

注意：
- 使用中文撰写所有分析内容
- 保持专业、客观的语调
- 重点突出最有价值和影响力的话题
- 只返回JSON，不要包含其他文本或markdown代码块标记`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的AI行业分析师，擅长分析技术趋势和热点话题。请严格按照要求的JSON格式返回结果。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = response.choices[0]?.message?.content || '';
      logger.info('AI 分析完成，正在解析结果...');

      // 解析 JSON 响应
      const analysisData = this.parseAIResponse(content);

      const report: AnalysisReport = {
        date: dateStr,
        title: `AI热点日报 - ${dateStr}`,
        overview: analysisData.overview || '暂无概述',
        categories: analysisData.categories || [],
        trendAnalysis: analysisData.trendAnalysis || '暂无趋势分析',
        rawTopics: topics,
        generatedAt: new Date().toISOString(),
      };

      logger.info('报告生成成功');
      return report;
    } catch (error) {
      logger.error(`AI 分析失败: ${error}`);
      // 降级方案：生成简单报告
      return this.createFallbackReport(dateStr, topics);
    }
  }

  /**
   * 解析 AI 返回的 JSON
   */
  private parseAIResponse(content: string): {
    overview: string;
    categories: TopicCategory[];
    trendAnalysis: string;
  } {
    try {
      // 尝试直接解析
      return JSON.parse(content);
    } catch {
      // 尝试提取 JSON 块
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          logger.warn('无法解析 AI 返回的 JSON，使用原始文本');
        }
      }
      return {
        overview: content,
        categories: [],
        trendAnalysis: '',
      };
    }
  }

  /**
   * 创建空报告
   */
  private createEmptyReport(date: string): AnalysisReport {
    return {
      date,
      title: `AI热点日报 - ${date}`,
      overview: '今日未获取到AI相关热点话题。',
      categories: [],
      trendAnalysis: '暂无数据，无法进行趋势分析。',
      rawTopics: [],
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * 降级方案：不使用AI的简单报告
   */
  private createFallbackReport(date: string, topics: HotTopic[]): AnalysisReport {
    // 简单按来源分组
    const sourceGroups = new Map<string, HotTopic[]>();
    for (const topic of topics) {
      const group = sourceGroups.get(topic.source) || [];
      group.push(topic);
      sourceGroups.set(topic.source, group);
    }

    const categories: TopicCategory[] = [];
    for (const [source, sourceTopics] of sourceGroups) {
      categories.push({
        name: source,
        description: `来自 ${source} 的AI热点`,
        topics: sourceTopics.slice(0, 10),
      });
    }

    return {
      date,
      title: `AI热点日报 - ${date}（简要版）`,
      overview: `今日共收集到 ${topics.length} 条AI相关热点话题，来自 ${sourceGroups.size} 个数据源。由于AI分析服务暂时不可用，以下为按来源分类的原始话题列表。`,
      categories,
      trendAnalysis: '（AI分析服务暂时不可用，趋势分析将在服务恢复后提供）',
      rawTopics: topics,
      generatedAt: new Date().toISOString(),
    };
  }
}
