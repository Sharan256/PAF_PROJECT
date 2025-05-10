package com.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf.model.WorkoutStatus;

@Repository
public interface WorkoutStatusRepository extends MongoRepository<WorkoutStatus, String> {

}