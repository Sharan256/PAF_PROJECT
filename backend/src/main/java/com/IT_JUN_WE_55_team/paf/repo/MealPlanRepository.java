package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.IT_JUN_WE_55_team.paf.model.MealPlan;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {

}
