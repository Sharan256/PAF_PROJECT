package com.PAFF_DS.paf.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.PAFF_DS.paf.model.RegistrationSource;

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
