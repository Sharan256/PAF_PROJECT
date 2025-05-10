package com.paf.service.impl;

import java.util.List;
import java.util.Optional;

import com.paf.model.MealPlan;
import com.paf.model.User;
import com.paf.repo.MealPlanRepository;
import com.paf.repo.UserRepository;
import com.paf.service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MealPlanServiceImpl implements MealPlanService {

    @Autowired
    private MealPlanRepository mealPlanRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<MealPlan> getAllMealPlans() {
        return mealPlanRepository.findAll();
    }

    @Override
    public Optional<MealPlan> getMealPlanById(String mealPlanId) {
        return mealPlanRepository.findById(mealPlanId);
    }

    @Override
    public MealPlan createMealPlan(MealPlan mealPlan) {
        Optional<User> userOptional = userRepository.findById(mealPlan.getUserId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            mealPlan.setUserId(user.getId());
            mealPlan.setUsername(user.getName());
            mealPlan.setUserProfile(user.getProfileImage());
            return mealPlanRepository.save(mealPlan);
        } else {
            return null;
        }
    }

    @Override
    public MealPlan updatMealPlan(String mealPlanId, MealPlan mealPlan) {
        if (mealPlanRepository.existsById(mealPlanId)) {
            Optional<User> userOptional = userRepository.findById(mealPlan.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                mealPlan.setUserId(user.getId());
                mealPlan.setUsername(user.getName());
                mealPlan.setUserProfile(user.getProfileImage());
                mealPlan.setMealPlanId(mealPlanId);
                mealPlan.setMealType(mealPlan.getMealType());
                mealPlan.setMealName(mealPlan.getMealName());
                mealPlan.setProtein(mealPlan.getProtein());
                mealPlan.setFats(mealPlan.getFats());
                mealPlan.setDescription(mealPlan.getDescription());
                mealPlan.setCalories(mealPlan.getCalories());
                mealPlan.setCarbs(mealPlan.getCarbs());
                mealPlan.setDate(mealPlan.getDate());
                return mealPlanRepository.save(mealPlan);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    public void deleteMealPlan(String mealPlanId) {
        mealPlanRepository.deleteById(mealPlanId);
    }

}
