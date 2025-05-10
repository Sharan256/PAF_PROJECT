package com.paf.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "mealPlans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealPlan {

    @Id
    private String mealPlanId;
    private String userId;
    private String mealType;
    private String mealName;
    private int protein;
    private int fats;
    private String description;
    private int calories;
    private int carbs;
    private String date;
    private String username;
    private String userProfile;

}
