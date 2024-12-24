# Blog System Requirements

## Core Features

### 1. Article Publishing
- Users can create new blog posts
- Users can edit existing blog posts
- Users can delete their blog posts
- Users can view all blog posts
- Users can view individual blog posts

### 2. User Comments
- Users can comment on blog posts
- Users can view comments on blog posts
- Users can delete their own comments

## Technical Requirements
- Backend: Java implementation
- Frontend: React implementation
- Database: In-memory database for initial implementation

## API Endpoints

### Articles
```
POST   /api/articles           - Create new article
GET    /api/articles          - List all articles
GET    /api/articles/{id}     - Get specific article
PUT    /api/articles/{id}     - Update article
DELETE /api/articles/{id}     - Delete article
```

### Comments
```
POST   /api/articles/{id}/comments     - Add comment to article
GET    /api/articles/{id}/comments     - Get comments for article
DELETE /api/articles/{id}/comments/{commentId} - Delete comment
```

## Data Models

### Article
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "authorId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Comment
```json
{
  "id": "string",
  "articleId": "string",
  "content": "string",
  "authorId": "string",
  "createdAt": "datetime"
}
```
