package com.PAFF_DS.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.PAFF_DS.paf.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
