package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.IT_JUN_WE_55_team.paf.model.WorkoutStatus;

@Repository
public interface WorkoutStatusRepository extends MongoRepository<WorkoutStatus, String> {

}