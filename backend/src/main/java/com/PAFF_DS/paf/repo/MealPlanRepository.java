package com.PAFF_DS.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.PAFF_DS.paf.model.MealPlan;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {

}
