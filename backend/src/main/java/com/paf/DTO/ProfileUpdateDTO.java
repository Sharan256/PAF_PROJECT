package com.paf.DTO;

import lombok.Data;

@Data
public class ProfileUpdateDTO {
    private String name;
    private String email;
    private String password;
    private String profileImage;
} 