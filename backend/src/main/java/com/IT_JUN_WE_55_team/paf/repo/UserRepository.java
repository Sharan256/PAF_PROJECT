package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.IT_JUN_WE_55_team.paf.model.User;

import java.util.Optional;
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    Optional<User> findById(String userId);

    boolean existsByEmail(String email);
}

