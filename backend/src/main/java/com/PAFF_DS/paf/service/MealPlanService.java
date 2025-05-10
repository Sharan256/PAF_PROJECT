package com.PAFF_DS.paf.service;

import java.util.List;
import java.util.Optional;

import com.PAFF_DS.paf.model.MealPlan;

public interface MealPlanService {
    List<MealPlan> getAllMealPlans();

    Optional<MealPlan> getMealPlanById(String mealPlanId);

    MealPlan createMealPlan(MealPlan mealPlan);

    MealPlan updatMealPlan(String mealPlanId, MealPlan mealPlan);

    void deleteMealPlan(String mealPlanId);
}
