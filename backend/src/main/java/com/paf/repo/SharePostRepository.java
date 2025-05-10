package com.paf.repo;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.model.SharePostModel;

import java.util.List;


@Repository
public interface SharePostRepository extends MongoRepository<SharePostModel, String> {
    List<SharePostModel> findByUserId(String userId);
}
