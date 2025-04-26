package com.IT_JUN_WE_55_team.paf.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;
    
    private String name;
    private String email;
    private String profileImage;
    private String mobileNumber;
    private String password;
    private RegistrationSource source;
    private int followersCount;
    private int followingCount;
    private List<String> followedUsers;
    private List<String> followingUsers;
}
