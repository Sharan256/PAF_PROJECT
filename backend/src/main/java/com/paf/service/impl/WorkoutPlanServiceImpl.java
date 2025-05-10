package com.paf.service.impl;

import java.util.List;
import java.util.Optional;

import com.paf.model.User;
import com.paf.model.WorkoutPlan;
import com.paf.repo.UserRepository;
import com.paf.repo.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf.service.WorkoutPlanService;

@Service
public class WorkoutPlanServiceImpl implements WorkoutPlanService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanRepository.findAll();
    }

    @Override
    public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id);
    }

    @Override
    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {
        Optional<User> userOptional = userRepository.findById(workoutPlan.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            workoutPlan.setUserId(user.getId());
            workoutPlan.setUsername(user.getName());
            workoutPlan.setUserProfile(user.getProfileImage());
            return workoutPlanRepository.save(workoutPlan);
        } else {
            return null;
        }
        
    }

    @Override
    public WorkoutPlan updateWorkoutPlan(String workoutPlanId, WorkoutPlan workoutPlan) {
        if (workoutPlanRepository.existsById(workoutPlanId)) {
            Optional<User> userOptional = userRepository.findById(workoutPlan.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                workoutPlan.setUserId(user.getId());
                workoutPlan.setUsername(user.getName());
                workoutPlan.setUserProfile(user.getProfileImage());
                workoutPlan.setWorkoutPlanId(workoutPlanId);
                workoutPlan.setWorkoutPlanName(workoutPlan.getWorkoutPlanName());
                workoutPlan.setSets(workoutPlan.getSets());
                workoutPlan.setRoutine(workoutPlan.getRoutine());
                workoutPlan.setDate(workoutPlan.getDate());
                workoutPlan.setExercises(workoutPlan.getExercises());
                workoutPlan.setRepetitions(workoutPlan.getRepetitions());
                workoutPlan.setDescription(workoutPlan.getDescription());
                return workoutPlanRepository.save(workoutPlan);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    public void deleteWorkoutPlan(String workoutPlanId) {
        workoutPlanRepository.deleteById(workoutPlanId);
    }

}
