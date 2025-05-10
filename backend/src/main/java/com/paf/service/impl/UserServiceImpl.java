package com.paf.service.impl;

import com.paf.DTO.ProfileUpdateDTO;
import com.paf.DTO.UserDTO;
import com.paf.DTO.UserResDTO;
import com.paf.model.RegistrationSource;
import com.paf.model.User;
import com.paf.repo.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.paf.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }

    @Override
    public ResponseEntity<Object> createUser(User user) {

        if(user.getSource() == null){
            if (userRepository.existsByEmail(user.getEmail())) {
                return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setFollowedUsers(new ArrayList<>());
            user.setSource(RegistrationSource.CREDENTIAL);
            User savedUser = userRepository.save(user);
            UserDTO savedUserDTO = new UserDTO();
            BeanUtils.copyProperties(savedUser, savedUserDTO);
            return new ResponseEntity<>("Register Successfully", HttpStatus.OK);
        }

        if(Objects.equals(user.getSource(), RegistrationSource.GOOGLE)){

            String email = user.getEmail();
            if (userRepository.existsByEmail(email)) {
                User googleUser = userRepository.findByEmail(email);
                UserResDTO userDto = new UserResDTO();
                BeanUtils.copyProperties(googleUser, userDto);
                return  new ResponseEntity<>(userDto, HttpStatus.OK);
            }

            User googleUser = new User();
            googleUser.setName(user.getName());
            googleUser.setEmail(user.getEmail());
            googleUser.setProfileImage(user.getProfileImage());
            googleUser.setSource(RegistrationSource.GOOGLE);
            try {
                userRepository.save(googleUser);
                UserResDTO userDto = new UserResDTO();
                BeanUtils.copyProperties(googleUser, userDto);
                return new ResponseEntity<>(userDto, HttpStatus.OK);
            } catch (DataIntegrityViolationException e) {
                return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return null;
    }

    @Override
    public UserDTO getUserById(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(optionalUser.get(), userDTO);
            return userDTO;
        }
        return null;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getActiveUsers() {
        List<User> users = userRepository.findByActiveTrue();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<Object> followUser(String userId, String followedUserId) {
        try {
            User user= userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

            User followUser = userRepository.findById(followedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + followedUserId));

            if (user.getFollowedUsers() == null) {
                user.setFollowedUsers(new ArrayList<>());
            }

            if (followUser.getFollowingUsers() == null) {
                followUser.setFollowingUsers(new ArrayList<>());
            }


            if (user.getFollowedUsers().contains(followedUserId)) {
                user.getFollowedUsers().remove(followedUserId);
                followUser.getFollowingUsers().remove(userId);
                user.setFollowersCount(user.getFollowersCount() - 1);
                followUser.setFollowingCount(followUser.getFollowingCount() -1);
                userRepository.save(user);
                userRepository.save(followUser);
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                user.getFollowedUsers().add(followedUserId);
                followUser.getFollowingUsers().add(userId);
                user.setFollowersCount(user.getFollowersCount() + 1);
                followUser.setFollowingCount(followUser.getFollowingCount() + 1);
                userRepository.save(user);
                userRepository.save(followUser);
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public ResponseEntity<Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (passwordEncoder.matches(password, user.getPassword())) {
            UserResDTO userDto = new UserResDTO();
            BeanUtils.copyProperties(user, userDto);
            user.setActive(true);
            userRepository.save(user);
            return new ResponseEntity<>(userDto, HttpStatus.OK);
    
        } else {
            return new ResponseEntity<>("Invalid password or email", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public ResponseEntity<Object> updateProfile(String userId, ProfileUpdateDTO profileUpdate) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User existingUser = optionalUser.get();
                
                // Validate email if it's being changed
                if (profileUpdate.getEmail() != null && !profileUpdate.getEmail().equals(existingUser.getEmail())) {
                    if (userRepository.existsByEmail(profileUpdate.getEmail())) {
                        return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
                    }
                }
                
                // Update only the fields that are provided and not empty
                if (profileUpdate.getName() != null && !profileUpdate.getName().trim().isEmpty()) {
                    existingUser.setName(profileUpdate.getName());
                }
                if (profileUpdate.getEmail() != null && !profileUpdate.getEmail().trim().isEmpty()) {
                    existingUser.setEmail(profileUpdate.getEmail());
                }
                if (profileUpdate.getPassword() != null && !profileUpdate.getPassword().trim().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(profileUpdate.getPassword()));
                }
                if (profileUpdate.getProfileImage() != null && !profileUpdate.getProfileImage().trim().isEmpty()) {
                    existingUser.setProfileImage(profileUpdate.getProfileImage());
                }
                
                User updatedUser = userRepository.save(existingUser);
                
                // Create response DTO with all necessary fields
                UserDTO userDTO = new UserDTO();
                BeanUtils.copyProperties(updatedUser, userDTO);
                
                return new ResponseEntity<>(userDTO, HttpStatus.OK);
            }
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error updating profile: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> deleteUser(String userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                userRepository.deleteById(userId);
                return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Object> activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(user));
    }

    @Override
    public ResponseEntity<Object> deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(user));
    }
}
