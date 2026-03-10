import { loadConfig, validateConfig } from './config';
import { Scheduler } from './services/scheduler';
import { logger } from './services/logger';

/**
 * CLI 工具 - 手动触发一次报告生成和发送
 * 使用: npm run report
 */
async function runOnce(): Promise<void> {
  logger.info('📊 手动触发 AI 热点分析报告...');

  const config = loadConfig();
  const errors = validateConfig(config);

  if (errors.length > 0) {
    logger.error('配置验证失败:');
    errors.forEach(err => logger.error(`  - ${err}`));
    process.exit(1);
  }

  const scheduler = new Scheduler(config);

  try {
    await scheduler.executeTask();
    logger.info('✅ 报告已成功生成并发送！');
  } catch (error) {
    logger.error(`❌ 报告生成或发送失败: ${error}`);
    process.exit(1);
  }
}

runOnce().catch(error => {
  logger.error(`执行失败: ${error}`);
  process.exit(1);
});
