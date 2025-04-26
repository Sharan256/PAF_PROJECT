package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.IT_JUN_WE_55_team.paf.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
