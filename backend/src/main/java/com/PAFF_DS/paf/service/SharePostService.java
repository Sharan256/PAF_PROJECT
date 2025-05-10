package com.PAFF_DS.paf.service;

import org.springframework.stereotype.Service;

import com.PAFF_DS.paf.DTO.ShareDTO;
import com.PAFF_DS.paf.model.SharePostModel;

import java.util.List;

@Service
public interface SharePostService {
    List<SharePostModel> getSharePosts();


    SharePostModel createSharePost(ShareDTO shareDTO);
    void deleteSharedPost(String id);

    List<SharePostModel> getSharePostsByuser(String id);
}
