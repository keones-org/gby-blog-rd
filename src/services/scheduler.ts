import { CronJob } from 'cron';
import { AppConfig } from '../types';
import { TopicFetcher } from './topic-fetcher';
import { AIAnalyzer } from './ai-analyzer';
import { EmailSender } from './email-sender';
import { logger } from './logger';

/**
 * 定时任务调度器
 * 按照配置的 Cron 表达式定时执行报告生成和推送
 */
export class Scheduler {
  private job: CronJob | null = null;
  private config: AppConfig;
  private topicFetcher: TopicFetcher;
  private aiAnalyzer: AIAnalyzer;
  private emailSender: EmailSender;

  constructor(config: AppConfig) {
    this.config = config;
    this.topicFetcher = new TopicFetcher();
    this.aiAnalyzer = new AIAnalyzer(config);
    this.emailSender = new EmailSender(config);
  }

  /**
   * 启动定时任务
   */
  start(): void {
    logger.info(`启动定时任务调度器...`);
    logger.info(`Cron 表达式: ${this.config.cronExpression}`);
    logger.info(`时区: ${this.config.timezone}`);
    logger.info(`收件人: ${this.config.recipients.join(', ')}`);

    this.job = new CronJob(
      this.config.cronExpression,
      () => {
        this.executeTask().catch(err => {
          logger.error(`定时任务执行失败: ${err}`);
        });
      },
      null,
      true,
      this.config.timezone
    );

    logger.info('定时任务已启动，等待下一次执行...');
  }

  /**
   * 停止定时任务
   */
  stop(): void {
    if (this.job) {
      this.job.stop();
      logger.info('定时任务已停止');
    }
  }

  /**
   * 立即执行一次报告生成和推送
   */
  async executeTask(): Promise<void> {
    const startTime = Date.now();
    logger.info('========== 开始执行 AI 热点分析任务 ==========');

    try {
      // 1. 抓取热点话题
      logger.info('步骤 1/3: 抓取热点话题...');
      const topics = await this.topicFetcher.fetchAll();

      if (topics.length === 0) {
        logger.warn('未获取到任何 AI 相关热点话题，跳过本次报告');
        return;
      }

      // 2. AI 分析生成报告
      logger.info('步骤 2/3: AI 分析生成报告...');
      const report = await this.aiAnalyzer.analyze(topics);

      // 3. 发送邮件
      logger.info('步骤 3/3: 发送报告邮件...');
      await this.emailSender.sendReport(report);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      logger.info(`========== 任务完成，耗时 ${elapsed}s ==========`);
    } catch (error) {
      logger.error(`任务执行过程中发生错误: ${error}`);
      throw error;
    }
  }
}
