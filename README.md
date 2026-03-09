# gby-blog-rd

博客系统后端项目，基于 Spring Boot + JPA + H2 构建的 RESTful API 服务。

## 技术栈

- **框架**: [Spring Boot 2.7](https://spring.io/projects/spring-boot)
- **ORM**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- **数据库**: [H2](https://www.h2database.com/)（内存数据库，开发/测试用）
- **工具库**: [Lombok](https://projectlombok.org/)
- **语言**: Java 11
- **构建工具**: [Maven](https://maven.apache.org/)

## 项目结构

```
gby-blog-rd/
├── src/
│   ├── main/
│   │   ├── java/com/gby/blog/
│   │   │   ├── BlogApplication.java          # 应用启动类
│   │   │   ├── controller/
│   │   │   │   ├── ArticleController.java     # 文章接口
│   │   │   │   └── CommentController.java     # 评论接口
│   │   │   ├── model/
│   │   │   │   ├── Article.java               # 文章实体
│   │   │   │   └── Comment.java               # 评论实体
│   │   │   └── repository/
│   │   │       ├── ArticleRepository.java     # 文章数据访问
│   │   │       └── CommentRepository.java     # 评论数据访问
│   │   └── resources/
│   │       └── application.properties         # 应用配置
├── pom.xml                                     # Maven 依赖配置
└── README.md
```

## 数据模型

### Article（文章）

| 字段        | 类型           | 说明         |
| ----------- | -------------- | ------------ |
| `id`        | Long (自增主键) | 文章 ID      |
| `title`     | String         | 文章标题     |
| `content`   | Text           | 文章内容     |
| `authorId`  | String         | 作者 ID      |
| `createdAt` | LocalDateTime  | 创建时间     |
| `updatedAt` | LocalDateTime  | 更新时间     |

### Comment（评论）

| 字段        | 类型           | 说明         |
| ----------- | -------------- | ------------ |
| `id`        | Long (自增主键) | 评论 ID      |
| `articleId` | Long           | 所属文章 ID  |
| `content`   | String         | 评论内容     |
| `author`    | String         | 评论者       |
| `createdAt` | LocalDateTime  | 创建时间     |

## API 接口

### 文章接口

| 方法     | 路径                 | 说明         |
| -------- | -------------------- | ------------ |
| `GET`    | `/api/articles`      | 获取所有文章 |
| `GET`    | `/api/articles/{id}` | 获取单篇文章 |
| `POST`   | `/api/articles`      | 创建文章     |
| `PUT`    | `/api/articles/{id}` | 更新文章     |
| `DELETE` | `/api/articles/{id}` | 删除文章     |

### 评论接口

| 方法     | 路径                                          | 说明             |
| -------- | --------------------------------------------- | ---------------- |
| `GET`    | `/api/articles/{articleId}/comments`           | 获取文章的评论   |
| `POST`   | `/api/articles/{articleId}/comments`           | 创建评论         |
| `DELETE` | `/api/articles/{articleId}/comments/{commentId}` | 删除评论       |

### 请求/响应示例

#### 创建文章

```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇博客",
    "content": "这是文章内容",
    "authorId": "user1"
  }'
```

响应：
```json
{
  "id": 1,
  "title": "我的第一篇博客",
  "content": "这是文章内容",
  "authorId": "user1",
  "createdAt": "2026-03-09T12:00:00",
  "updatedAt": "2026-03-09T12:00:00"
}
```

#### 创建评论

```bash
curl -X POST http://localhost:8080/api/articles/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "写得真好！",
    "author": "reader1"
  }'
```

## 快速开始

### 环境要求

- JDK 11+
- Maven 3.6+

### 构建与运行

```bash
# 编译项目
mvn clean package

# 运行应用
mvn spring-boot:run
```

应用启动后访问 http://localhost:8080。

### H2 数据库控制台

开发模式下可通过 http://localhost:8080/h2-console 访问数据库管理界面。

连接信息：
- JDBC URL: `jdbc:h2:mem:blogdb`
- 用户名: `sa`
- 密码: （空）

## 配置说明

主要配置在 `src/main/resources/application.properties` 中：

```properties
# 数据库配置
spring.datasource.url=jdbc:h2:mem:blogdb
spring.datasource.driverClassName=org.h2.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# 服务端口
server.port=8080
```

## 前端项目

对应的前端项目为 [gby-blog-fe](https://github.com/keones-org/gby-blog-fe)，基于 UmiJS + React 构建。

## 参考文档

- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Data JPA 文档](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [H2 Database 文档](https://www.h2database.com/html/main.html)
