package com.IT_JUN_WE_55_team.paf.controller;

import java.util.List;
import java.util.Optional;

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

import com.IT_JUN_WE_55_team.paf.model.WorkoutPlan;
import com.IT_JUN_WE_55_team.paf.service.WorkoutPlanService;

@RestController
@RequestMapping("/workoutPlans")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @GetMapping
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanService.getAllWorkoutPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getWorkoutPlanById(@PathVariable String id) {
        Optional<WorkoutPlan> workoutPlans = workoutPlanService.getWorkoutPlanById(id);
        return workoutPlans.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<WorkoutPlan> createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {
        WorkoutPlan savedWorkoutPlan = workoutPlanService.createWorkoutPlan(workoutPlan);
        return new ResponseEntity<>(savedWorkoutPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlan> updateWorkout(@PathVariable String id,
                                                     @RequestBody WorkoutPlan workoutPlan) {
        WorkoutPlan updatedWorkoutPlan = workoutPlanService.updateWorkoutPlan(id, workoutPlan);
        if (updatedWorkoutPlan != null) {
            return new ResponseEntity<>(updatedWorkoutPlan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{workoutPlanId}")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable String workoutPlanId) {
        workoutPlanService.deleteWorkoutPlan(workoutPlanId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
