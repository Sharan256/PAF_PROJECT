package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.IT_JUN_WE_55_team.paf.model.Post;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    Post findPostById(String id);

    List<Post> findByUserId(String userId);
}