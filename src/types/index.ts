/**
 * AI热点数据分析系统 - 类型定义
 */

/** 热点话题数据源 */
export interface HotTopic {
  /** 标题 */
  title: string;
  /** 链接 */
  url: string;
  /** 来源平台 */
  source: string;
  /** 热度/得分 */
  score: number;
  /** 摘要描述 */
  summary?: string;
  /** 发布时间 */
  publishedAt?: string;
  /** 标签 */
  tags?: string[];
}

/** 数据源接口 */
export interface DataSource {
  /** 数据源名称 */
  name: string;
  /** 抓取热点话题 */
  fetchTopics(): Promise<HotTopic[]>;
}

/** AI分析报告 */
export interface AnalysisReport {
  /** 报告日期 */
  date: string;
  /** 报告标题 */
  title: string;
  /** 总体概述 */
  overview: string;
  /** 热点话题分类 */
  categories: TopicCategory[];
  /** 趋势分析 */
  trendAnalysis: string;
  /** 原始热点数据 */
  rawTopics: HotTopic[];
  /** 生成时间 */
  generatedAt: string;
}

/** 话题分类 */
export interface TopicCategory {
  /** 分类名称 */
  name: string;
  /** 分类描述 */
  description: string;
  /** 该分类下的话题 */
  topics: HotTopic[];
}

/** 邮件配置 */
export interface EmailConfig {
  /** SMTP 主机 */
  host: string;
  /** SMTP 端口 */
  port: number;
  /** 是否使用SSL */
  secure: boolean;
  /** 用户名 */
  user: string;
  /** 密码/授权码 */
  pass: string;
  /** 发件人名称 */
  fromName: string;
  /** 发件人地址 */
  fromAddress: string;
}

/** 应用配置 */
export interface AppConfig {
  /** OpenAI API Key */
  openaiApiKey: string;
  /** OpenAI Base URL (可选，用于兼容其他API) */
  openaiBaseUrl?: string;
  /** OpenAI 模型 */
  openaiModel: string;
  /** 邮件配置 */
  email: EmailConfig;
  /** 收件人列表 */
  recipients: string[];
  /** Cron 表达式 (默认每天早上8点) */
  cronExpression: string;
  /** 时区 */
  timezone: string;
}
