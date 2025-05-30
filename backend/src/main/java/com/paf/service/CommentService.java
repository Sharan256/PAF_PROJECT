package com.paf.service;

import java.util.List;

import com.paf.model.Comment;

public interface CommentService {
    List<Comment> getCommentsForPost(String postId);
    Comment addCommentToPost(String postId, String content, String commentBy, String commentById, String commentByProfile, String media);
    void deleteComment(String postId, String commentId);

    Comment editComment(String commentId, String content, String media);
}
