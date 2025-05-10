package com.paf.service;

import com.paf.DTO.ShareDTO;
import org.springframework.stereotype.Service;

import com.paf.model.SharePostModel;

import java.util.List;

@Service
public interface SharePostService {
    List<SharePostModel> getSharePosts();


    SharePostModel createSharePost(ShareDTO shareDTO);
    void deleteSharedPost(String id);

    List<SharePostModel> getSharePostsByuser(String id);
}
