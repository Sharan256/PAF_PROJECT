package com.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    Optional<User> findById(String userId);

    boolean existsByEmail(String email);

    List<User> findByActiveTrue();
}

