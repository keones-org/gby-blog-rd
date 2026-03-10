import dotenv from 'dotenv';
import { AppConfig } from './types';

dotenv.config();

/**
 * 从环境变量加载应用配置
 */
export function loadConfig(): AppConfig {
  const recipients = process.env.EMAIL_RECIPIENTS || '';

  return {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiBaseUrl: process.env.OPENAI_BASE_URL || undefined,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    email: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE !== 'false',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      fromName: process.env.EMAIL_FROM_NAME || 'AI热点分析系统',
      fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || '',
    },
    recipients: recipients.split(',').map(e => e.trim()).filter(Boolean),
    cronExpression: process.env.CRON_EXPRESSION || '0 8 * * *',
    timezone: process.env.TIMEZONE || 'Asia/Shanghai',
  };
}

/**
 * 验证配置完整性
 */
export function validateConfig(config: AppConfig): string[] {
  const errors: string[] = [];

  if (!config.openaiApiKey) {
    errors.push('缺少 OPENAI_API_KEY 环境变量');
  }
  if (!config.email.user) {
    errors.push('缺少 SMTP_USER 环境变量');
  }
  if (!config.email.pass) {
    errors.push('缺少 SMTP_PASS 环境变量');
  }
  if (config.recipients.length === 0) {
    errors.push('缺少 EMAIL_RECIPIENTS 环境变量（逗号分隔的邮箱列表）');
  }

  return errors;
}
