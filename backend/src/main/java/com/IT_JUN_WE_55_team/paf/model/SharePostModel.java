package com.IT_JUN_WE_55_team.paf.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shared_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SharePostModel {
    @Id
    private String id;
    private User sharedBy;
    private String userId;
    private Post post;
    private String description;
    private String shared;
}
