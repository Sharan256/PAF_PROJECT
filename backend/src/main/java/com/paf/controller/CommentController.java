package com.paf.controller;

import java.util.List;

import com.paf.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId));
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> addCommentToPost(
            @PathVariable String postId,
            @RequestParam String content,
            @RequestParam String commentBy,
            @RequestParam String commentById,
            @RequestParam String commentByProfile,
            @RequestParam(required = false) String media) {
        Comment comment = commentService.addCommentToPost(postId, content, commentBy, commentById, commentByProfile, media);
        return comment != null ? ResponseEntity.ok(comment) : ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{postId}/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        commentService.deleteComment(postId, commentId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable String commentId,
            @RequestParam String content,
            @RequestParam(required = false) String media) {
        Comment comment = commentService.editComment(commentId, content, media);
        return comment != null ? ResponseEntity.ok(comment) : ResponseEntity.badRequest().build();
    }
}