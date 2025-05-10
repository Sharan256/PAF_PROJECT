package com.paf.controller;

import com.paf.DTO.ProfileUpdateDTO;
import com.paf.DTO.UserDTO;
import com.paf.model.User;
import com.paf.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Object> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{userId}")
    public UserDTO getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/active")
    public List<UserDTO> getActiveUsers() {
        return userService.getActiveUsers();
    }

    @PostMapping("/follow")
    public ResponseEntity<Object> followUser(@RequestParam String userId, @RequestParam String FollowedUserId) {
        return userService.followUser(userId, FollowedUserId);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user) {
        return userService.loginUser(user.getEmail(), user.getPassword());
    }

    @PostMapping("/{userId}/activate")
    public ResponseEntity<Object> activateUser(@PathVariable String userId) {
        return userService.activateUser(userId);
    }

    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<Object> deactivateUser(@PathVariable String userId) {
        return userService.deactivateUser(userId);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Object> updateProfile(@PathVariable String userId, @RequestBody ProfileUpdateDTO profileUpdate) {
        return userService.updateProfile(userId, profileUpdate);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Object> deleteUser(@PathVariable String userId) {
        return userService.deleteUser(userId);
    }
}

