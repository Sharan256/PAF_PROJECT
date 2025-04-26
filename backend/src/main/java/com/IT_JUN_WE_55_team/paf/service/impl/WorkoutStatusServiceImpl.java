package com.IT_JUN_WE_55_team.paf.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.IT_JUN_WE_55_team.paf.model.User;
import com.IT_JUN_WE_55_team.paf.model.WorkoutStatus;
import com.IT_JUN_WE_55_team.paf.repo.UserRepository;
import com.IT_JUN_WE_55_team.paf.repo.WorkoutStatusRepository;
import com.IT_JUN_WE_55_team.paf.service.WorkoutStatusService;

@Service
public class WorkoutStatusServiceImpl implements WorkoutStatusService {

    @Autowired
    private WorkoutStatusRepository workoutStatusRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public List<WorkoutStatus> getAllWorkoutStatus() {
        return workoutStatusRepository.findAll();
    }

    @Override
    public Optional<WorkoutStatus> getWorkoutStatsusById(String statusId) {
        return workoutStatusRepository.findById(statusId);
    }

    @Override
    public WorkoutStatus createWorkoutStatus(WorkoutStatus workoutStatus) {
        Optional<User> userOptional = userRepository.findById(workoutStatus.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            workoutStatus.setUserId(user.getId());
            workoutStatus.setUsername(user.getName());
            workoutStatus.setUserProfile(user.getProfileImage());
            return workoutStatusRepository.save(workoutStatus);
        } else {
            return null;
        }
    }

    @Override
    public WorkoutStatus updateWorkoutStatus(String statusId, WorkoutStatus workoutStatus) {

        if (workoutStatusRepository.existsById(statusId)) {
            Optional<User> userOptional = userRepository.findById(workoutStatus.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                workoutStatus.setUserId(user.getId());
                workoutStatus.setUsername(user.getName());
                workoutStatus.setUserProfile(user.getProfileImage());
                workoutStatus.setStatusId(statusId);
                workoutStatus.setDistance(workoutStatus.getDistance());
                workoutStatus.setPushUps(workoutStatus.getPushUps());
                workoutStatus.setWeight(workoutStatus.getWeight());
                workoutStatus.setDescription(workoutStatus.getDescription());
                workoutStatus.setDate(workoutStatus.getDate());
                return workoutStatusRepository.save(workoutStatus);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    public void deleteWorkoutStatus(String statusId) {
        workoutStatusRepository.deleteById(statusId);
    }

}