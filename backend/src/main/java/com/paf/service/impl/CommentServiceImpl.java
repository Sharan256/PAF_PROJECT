package com.paf.service.impl;

import com.paf.model.Comment;
import com.paf.model.Post;
import com.paf.repo.CommentRepository;
import com.paf.repo.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.service.CommentService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Override
    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostId(postId);
    }

    @Override
    public Comment addCommentToPost(String postId, String content, String commentBy, String commentById, String commentByProfile, String media) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Comment comment = new Comment();
            comment.setPostId(postId);
            comment.setContent(content);
            comment.setCommentBy(commentBy);
            comment.setCommentById(commentById);
            comment.setCommentByProfile(commentByProfile);
            comment.setMedia(media);
            comment.setCreatedAt(String.valueOf(new Date()));
            return commentRepository.save(comment);
        }
        return null;
    }

    @Override
    public void deleteComment(String postId, String commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    public Comment editComment(String commentId, String content, String media) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            comment.setContent(content);
            if (media != null) {
                comment.setMedia(media);
            }
            return commentRepository.save(comment);
        }
        return null;
    }
}

