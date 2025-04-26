package com.IT_JUN_WE_55_team.paf.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private String id;
    private String title;
    private String date;
    private List<String> images;
    private String video;
    private String description;
}
