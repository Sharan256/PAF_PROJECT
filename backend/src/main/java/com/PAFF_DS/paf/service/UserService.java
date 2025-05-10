package com.PAFF_DS.paf.service;

import org.springframework.http.ResponseEntity;

import com.PAFF_DS.paf.DTO.UserDTO;
import com.PAFF_DS.paf.model.User;

import java.util.List;

public interface UserService {
    ResponseEntity<Object> createUser(User user);
    UserDTO getUserById(String userId);
    List<UserDTO> getAllUsers();
    ResponseEntity<Object> followUser(String userId, String followedUserId);

    ResponseEntity<Object> loginUser(String email, String password);
}
