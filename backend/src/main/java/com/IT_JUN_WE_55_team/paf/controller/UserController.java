package com.IT_JUN_WE_55_team.paf.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.IT_JUN_WE_55_team.paf.DTO.UserDTO;
import com.IT_JUN_WE_55_team.paf.model.User;
import com.IT_JUN_WE_55_team.paf.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
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

    @PostMapping("/follow")
    public ResponseEntity<Object> followUser(@RequestParam String userId, @RequestParam String FollowedUserId) {
        return userService.followUser(userId,FollowedUserId);
    }
    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user) {

        return userService.loginUser(user.getEmail(), user.getPassword());

    }
}

