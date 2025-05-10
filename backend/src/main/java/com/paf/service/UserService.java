package com.paf.service;

import com.paf.DTO.ProfileUpdateDTO;
import com.paf.DTO.UserDTO;
import com.paf.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    ResponseEntity<Object> createUser(User user);
    UserDTO getUserById(String userId);
    List<UserDTO> getAllUsers();
    List<UserDTO> getActiveUsers();
    ResponseEntity<Object> followUser(String userId, String followedUserId);

    ResponseEntity<Object> loginUser(String email, String password);

    ResponseEntity<Object> activateUser(String userId);
    ResponseEntity<Object> deactivateUser(String userId);

    ResponseEntity<Object> updateProfile(String userId, ProfileUpdateDTO profileUpdate);
    ResponseEntity<Object> deleteUser(String userId);
}
