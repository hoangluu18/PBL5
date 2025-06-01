package com.pbl5.admin.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Integer id;
    private String name;
    private String alias;
    private boolean enabled;
    private String image;
    private Integer parent_id;
    private String all_parent_ids;
}
