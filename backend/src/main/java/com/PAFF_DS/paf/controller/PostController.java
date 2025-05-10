package com.PAFF_DS.paf.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PAFF_DS.paf.DTO.PostDTO;
import com.PAFF_DS.paf.model.Post;
import com.PAFF_DS.paf.service.PostService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post savedPost = postService.createPost(post);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Post> updatePost(@RequestBody PostDTO postDTO) {
        return postService.editPost(postDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/like")
    public ResponseEntity<Object> likePost(@RequestParam String postId, @RequestParam String userId) {
        return postService.likePost(postId,userId);
    }

    @GetMapping("user/{userId}")
    public List<Post> getPostByIdUserId(@PathVariable String userId) {
       return postService.getPostByIdUserId(userId);
    }
}