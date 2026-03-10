import { loadConfig, validateConfig } from './config';
import { Scheduler } from './services/scheduler';
import { logger } from './services/logger';

/**
 * AI热点数据分析系统 - 主入口
 *
 * 功能：
 * 1. 每日自动从多个平台抓取 AI 领域热点话题
 * 2. 使用 OpenAI 对话题进行分类和分析
 * 3. 生成精美的 HTML 报告邮件
 * 4. 定时推送至指定收件人邮箱
 *
 * 数据源：
 * - Hacker News (AI相关热门帖子)
 * - GitHub Trending (AI相关热门开源项目)
 * - TechCrunch (AI新闻)
 */
async function main(): Promise<void> {
  logger.info('🚀 AI热点数据分析系统启动中...');

  // 加载并验证配置
  const config = loadConfig();
  const errors = validateConfig(config);

  if (errors.length > 0) {
    logger.error('配置验证失败:');
    errors.forEach(err => logger.error(`  - ${err}`));
    logger.info('请参考 .env.example 文件配置环境变量');
    process.exit(1);
  }

  // 创建调度器
  const scheduler = new Scheduler(config);

  // 检查是否需要立即执行一次
  if (process.argv.includes('--run-now')) {
    logger.info('检测到 --run-now 参数，立即执行一次...');
    await scheduler.executeTask();

    if (!process.argv.includes('--daemon')) {
      logger.info('单次执行完成，退出程序');
      return;
    }
  }

  // 启动定时任务
  scheduler.start();

  // 优雅退出
  const shutdown = () => {
    logger.info('收到退出信号，正在关闭...');
    scheduler.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  logger.info('系统已启动，按 Ctrl+C 退出');
}

main().catch(error => {
  logger.error(`系统启动失败: ${error}`);
  process.exit(1);
});
