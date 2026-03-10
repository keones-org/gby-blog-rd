# AI热点数据分析系统

每日自动抓取 AI 领域热点话题，使用 AI 进行深度分析，生成精美报告并推送至指定邮箱。

## 功能特点

- **多平台数据源**：从 Hacker News、GitHub Trending、TechCrunch 等平台抓取 AI 相关热点
- **AI 智能分析**：使用 OpenAI GPT 模型对热点进行分类、总结和趋势分析
- **精美邮件报告**：生成专业的 HTML 格式邮件报告，包含概述、分类话题、趋势分析
- **定时推送**：支持自定义 Cron 表达式，默认每天早上 8 点（北京时间）自动推送
- **容错降级**：AI 服务不可用时自动降级为简单分类报告

## 系统架构

```
┌─────────────────────────────────────────────────┐
│                  定时调度器 (Cron)                 │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  数据抓取  │→│  AI 分析  │→│  邮件报告推送   │  │
│  └──────────┘  └──────────┘  └────────────────┘  │
│       │                                           │
│  ┌────┴─────────────────┐                        │
│  │ · Hacker News        │                        │
│  │ · GitHub Trending    │                        │
│  │ · TechCrunch         │                        │
│  └──────────────────────┘                        │
└─────────────────────────────────────────────────┘
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写相关配置：

```bash
cp .env.example .env
```

需要配置的关键项：

| 环境变量 | 说明 | 必填 |
|---------|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | 是 |
| `OPENAI_BASE_URL` | OpenAI API 地址（可选，用于兼容其他接口） | 否 |
| `OPENAI_MODEL` | AI 模型（默认 `gpt-4o-mini`） | 否 |
| `SMTP_HOST` | SMTP 服务器地址 | 是 |
| `SMTP_PORT` | SMTP 端口（默认 465） | 否 |
| `SMTP_USER` | SMTP 用户名 | 是 |
| `SMTP_PASS` | SMTP 密码/授权码 | 是 |
| `EMAIL_RECIPIENTS` | 收件人列表（逗号分隔） | 是 |
| `CRON_EXPRESSION` | 定时表达式（默认 `0 8 * * *`） | 否 |
| `TIMEZONE` | 时区（默认 `Asia/Shanghai`） | 否 |

### 3. 启动服务

```bash
# 编译
npm run build

# 启动定时任务（后台运行）
npm start

# 或立即执行一次并退出
npm start -- --run-now

# 立即执行并继续守护运行
npm start -- --run-now --daemon
```

### 4. 手动触发报告

```bash
npm run report
```

## 开发

```bash
# 开发模式运行
npm run dev

# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 编译
npm run build
```

## 邮件常见 SMTP 配置

### Gmail
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_PASS=（需生成应用专用密码）
```

### QQ邮箱
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_PASS=（需获取授权码）
```

### 163邮箱
```
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_PASS=（需获取授权码）
```

## 项目结构

```
src/
├── index.ts              # 主入口（定时任务模式）
├── cli.ts                # CLI 入口（手动触发）
├── config.ts             # 配置加载与验证
├── types/
│   └── index.ts          # TypeScript 类型定义
├── sources/              # 数据源模块
│   ├── index.ts
│   ├── hackernews.ts     # Hacker News 数据源
│   ├── github-trending.ts # GitHub Trending 数据源
│   └── techcrunch.ts     # TechCrunch 数据源
├── services/             # 核心服务
│   ├── logger.ts         # 日志服务
│   ├── topic-fetcher.ts  # 话题抓取聚合器
│   ├── ai-analyzer.ts    # AI 分析服务
│   ├── email-sender.ts   # 邮件发送服务
│   └── scheduler.ts      # 定时任务调度器
└── templates/
    └── email-template.ts # 邮件 HTML 模板
```

## License

MIT
