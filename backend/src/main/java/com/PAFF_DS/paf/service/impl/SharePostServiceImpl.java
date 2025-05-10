package com.PAFF_DS.paf.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PAFF_DS.paf.DTO.ShareDTO;
import com.PAFF_DS.paf.model.Post;
import com.PAFF_DS.paf.model.SharePostModel;
import com.PAFF_DS.paf.model.User;
import com.PAFF_DS.paf.repo.PostRepository;
import com.PAFF_DS.paf.repo.SharePostRepository;
import com.PAFF_DS.paf.repo.UserRepository;
import com.PAFF_DS.paf.service.SharePostService;

import java.util.List;
@Service
public class SharePostServiceImpl implements SharePostService {

    @Autowired
    private SharePostRepository sharePostRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public List<SharePostModel> getSharePosts() {
        return sharePostRepository.findAll();
    }

    @Override
    public SharePostModel createSharePost(ShareDTO shareDTO) {

        Post post = postRepository.findById(shareDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(shareDTO.getUserid())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try{
            SharePostModel sharePostModel = new SharePostModel();
            sharePostModel.setSharedBy(user);
            sharePostModel.setPost(post);
            sharePostModel.setDescription(shareDTO.getDescription());
            sharePostModel.setShared("shared");
            sharePostModel.setUserId(shareDTO.getUserid());
            return sharePostRepository.save(sharePostModel);
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public void deleteSharedPost(String id) {
        sharePostRepository.deleteById(id);
    }

    @Override
    public List<SharePostModel> getSharePostsByuser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sharePostRepository.findByUserId(id);
    }


}
