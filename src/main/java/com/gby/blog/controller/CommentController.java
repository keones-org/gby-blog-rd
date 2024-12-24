package com.gby.blog.controller;

import com.gby.blog.model.Comment;
import com.gby.blog.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{articleId}/comments")
public class CommentController {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @GetMapping
    public List<Comment> getCommentsByArticle(@PathVariable Long articleId) {
        return commentRepository.findByArticleId(articleId);
    }
    
    @PostMapping
    public Comment createComment(@PathVariable Long articleId, @RequestBody Comment comment) {
        comment.setArticleId(articleId);
        return commentRepository.save(comment);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long articleId, @PathVariable Long commentId) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    if (!comment.getArticleId().equals(articleId)) {
                        return ResponseEntity.badRequest().build();
                    }
                    commentRepository.delete(comment);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
