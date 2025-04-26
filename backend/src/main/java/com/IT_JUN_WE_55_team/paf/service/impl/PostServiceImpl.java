package com.IT_JUN_WE_55_team.paf.service.impl;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.IT_JUN_WE_55_team.paf.DTO.PostDTO;
import com.IT_JUN_WE_55_team.paf.model.Post;
import com.IT_JUN_WE_55_team.paf.model.User;
import com.IT_JUN_WE_55_team.paf.repo.PostRepository;
import com.IT_JUN_WE_55_team.paf.repo.UserRepository;
import com.IT_JUN_WE_55_team.paf.service.CommentService;
import com.IT_JUN_WE_55_team.paf.service.PostService;

import java.util.*;


@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentService commentService;

    @Override
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            post.setComments(commentService.getCommentsForPost(post.getId()));
        }

        posts.sort(Comparator.comparing(Post::getDate).reversed());
        return posts;
    }

    @Override
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Override
    public Post createPost(Post post) {
        post.setDate(String.valueOf(new Date()));
        return postRepository.save(post);
    }

    @Override
    public ResponseEntity<Post> editPost(PostDTO postDTO) {
        Post post = postRepository.findById(postDTO.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        try {
            post.setTitle(postDTO.getTitle());
            List<String> images = postDTO.getImages();
            if (images != null && !images.isEmpty()) {
                post.setImages(images);
            } else {
                post.setImages(Collections.emptyList());
            }
            post.setDescription(postDTO.getDescription());
            post.setDate(String.valueOf(new Date()));
            post.setVideo(postDTO.getVideo());
            postRepository.save(post);

            return new ResponseEntity<>(post, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<Object> likePost(String postId, String userId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            if (post.getLikedBy() == null) {
                post.setLikedBy(new ArrayList<>());
            }

            if (post.getLikedBy().contains(userId)) {
                post.getLikedBy().remove(userId);
                post.setLikeCount(post.getLikeCount() - 1);
                postRepository.save(post);
                return new ResponseEntity<>(post, HttpStatus.OK);
            } else {
                post.getLikedBy().add(userId);
                post.setLikeCount(post.getLikeCount() + 1);
                postRepository.save(post);
                return new ResponseEntity<>(post, HttpStatus.OK);
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<Post> getPostByIdUserId(String userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        for (Post post : posts) {
            post.setComments(commentService.getCommentsForPost(post.getId()));
        }
        return posts;
    }


}

