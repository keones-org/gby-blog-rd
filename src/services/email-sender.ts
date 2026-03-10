import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AnalysisReport } from '../types';
import { AppConfig } from '../types';
import { logger } from './logger';
import { getEmailTemplate } from '../templates/email-template';

/**
 * 邮件发送服务
 * 将分析报告以精美的HTML邮件推送给指定收件人
 */
export class EmailSender {
  private transporter: nodemailer.Transporter;
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  /**
   * 发送分析报告邮件
   */
  async sendReport(report: AnalysisReport): Promise<void> {
    logger.info(`准备发送报告邮件给 ${this.config.recipients.length} 位收件人...`);

    const htmlContent = this.renderReport(report);

    const mailOptions = {
      from: `"${this.config.email.fromName}" <${this.config.email.fromAddress}>`,
      to: this.config.recipients.join(', '),
      subject: `📊 ${report.title}`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`邮件发送成功! MessageId: ${info.messageId}`);
    } catch (error) {
      logger.error(`邮件发送失败: ${error}`);
      throw error;
    }
  }

  /**
   * 验证SMTP连接
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('SMTP 连接验证成功');
      return true;
    } catch (error) {
      logger.error(`SMTP 连接验证失败: ${error}`);
      return false;
    }
  }

  /**
   * 使用 Handlebars 渲染报告为 HTML
   */
  private renderReport(report: AnalysisReport): string {
    const templateSource = getEmailTemplate();
    const template = Handlebars.compile(templateSource);

    return template({
      title: report.title,
      date: report.date,
      overview: report.overview,
      categories: report.categories,
      trendAnalysis: report.trendAnalysis,
      totalTopics: report.rawTopics.length,
      generatedAt: new Date(report.generatedAt).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
      }),
      hasCategories: report.categories.length > 0,
    });
  }
}
