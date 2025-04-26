package com.IT_JUN_WE_55_team.paf.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String content;
    private String commentBy;
    private String commentById;
    private String commentByProfile;
}
