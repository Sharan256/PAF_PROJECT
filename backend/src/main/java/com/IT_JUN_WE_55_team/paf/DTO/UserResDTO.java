package com.IT_JUN_WE_55_team.paf.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.IT_JUN_WE_55_team.paf.model.RegistrationSource;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResDTO {

    private String id;

    private String name;

    private String email;

    private String profileImage;

    private RegistrationSource source;

    private List<String> followedUsers;
}
