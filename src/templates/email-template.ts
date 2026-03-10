/**
 * 邮件 HTML 模板
 * 使用 Handlebars 语法
 */
export function getEmailTemplate(): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 680px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header .date {
      font-size: 14px;
      opacity: 0.9;
    }
    .header .stats {
      margin-top: 12px;
      font-size: 13px;
      opacity: 0.85;
    }
    .section {
      padding: 24px;
      border-bottom: 1px solid #eee;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 3px solid #667eea;
      display: inline-block;
    }
    .overview {
      font-size: 15px;
      color: #555;
      white-space: pre-line;
    }
    .category {
      margin-bottom: 24px;
    }
    .category:last-child {
      margin-bottom: 0;
    }
    .category-name {
      font-size: 16px;
      font-weight: 700;
      color: #764ba2;
      margin: 0 0 6px 0;
    }
    .category-desc {
      font-size: 13px;
      color: #888;
      margin: 0 0 12px 0;
    }
    .topic-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .topic-item {
      padding: 10px 14px;
      margin-bottom: 8px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .topic-item:hover {
      background-color: #eef0ff;
    }
    .topic-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    .topic-title a {
      color: #333;
      text-decoration: none;
    }
    .topic-title a:hover {
      color: #667eea;
      text-decoration: underline;
    }
    .topic-meta {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
    .topic-meta .source {
      background-color: #e8e8e8;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
    }
    .topic-meta .score {
      color: #e67e22;
      font-weight: 600;
    }
    .trend-analysis {
      font-size: 15px;
      color: #555;
      white-space: pre-line;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 24px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 {{title}}</h1>
      <div class="date">{{date}}</div>
      <div class="stats">共收录 {{totalTopics}} 条AI领域热点话题</div>
    </div>

    <div class="section">
      <h2 class="section-title">📋 今日概述</h2>
      <div class="overview">{{overview}}</div>
    </div>

    {{#if hasCategories}}
    <div class="section">
      <h2 class="section-title">🔥 热点分类</h2>
      {{#each categories}}
      <div class="category">
        <h3 class="category-name">{{this.name}}</h3>
        <p class="category-desc">{{this.description}}</p>
        <ul class="topic-list">
          {{#each this.topics}}
          <li class="topic-item">
            <div class="topic-title">
              <a href="{{this.url}}" target="_blank">{{this.title}}</a>
            </div>
            <div class="topic-meta">
              <span class="source">{{this.source}}</span>
              {{#if this.score}}
              <span class="score"> ⭐ {{this.score}}</span>
              {{/if}}
            </div>
          </li>
          {{/each}}
        </ul>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <div class="section">
      <h2 class="section-title">📈 趋势分析</h2>
      <div class="trend-analysis">{{trendAnalysis}}</div>
    </div>

    <div class="footer">
      <p>此报告由 AI热点数据分析系统 自动生成</p>
      <p>生成时间: {{generatedAt}}</p>
      <p>数据来源: Hacker News · GitHub Trending · TechCrunch</p>
    </div>
  </div>
</body>
</html>`;
}
