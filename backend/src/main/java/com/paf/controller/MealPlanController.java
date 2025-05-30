package com.paf.controller;

import java.util.List;
import java.util.Optional;

import com.paf.model.MealPlan;
import com.paf.service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mealPlans")
public class MealPlanController {

    @Autowired
    private MealPlanService mealPlanService;

    @GetMapping
    public List<MealPlan> getAllMealPlans() {
        return mealPlanService.getAllMealPlans();
    }

    @GetMapping("/{mealPlanId}")
    public ResponseEntity<MealPlan> getMealPlanById(@PathVariable String mealPlanId) {
        Optional<MealPlan> mealPlan = mealPlanService.getMealPlanById(mealPlanId);
        return mealPlan.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/add")
    public ResponseEntity<MealPlan> createMealPlan(@RequestBody MealPlan mealPlan) {
        MealPlan savedMealPlan = mealPlanService.createMealPlan(mealPlan);
        return new ResponseEntity<>(savedMealPlan, HttpStatus.CREATED);
    }

    @PutMapping("/update/{mealPlanId}")
    public ResponseEntity<MealPlan> updateMealPlan(@PathVariable String mealPlanId, @RequestBody MealPlan mealplan) {
        MealPlan updatedMealPlan = mealPlanService.updatMealPlan(mealPlanId, mealplan);
        if (updatedMealPlan != null) {
            return new ResponseEntity<>(updatedMealPlan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{mealPlanId}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable String mealPlanId) {
        mealPlanService.deleteMealPlan(mealPlanId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
