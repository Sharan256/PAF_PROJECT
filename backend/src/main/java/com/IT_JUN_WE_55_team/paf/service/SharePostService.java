package com.IT_JUN_WE_55_team.paf.service;

import org.springframework.stereotype.Service;

import com.IT_JUN_WE_55_team.paf.DTO.ShareDTO;
import com.IT_JUN_WE_55_team.paf.model.SharePostModel;

import java.util.List;

@Service
public interface SharePostService {
    List<SharePostModel> getSharePosts();


    SharePostModel createSharePost(ShareDTO shareDTO);
    void deleteSharedPost(String id);

    List<SharePostModel> getSharePostsByuser(String id);
}
