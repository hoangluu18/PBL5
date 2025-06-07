package com.pbl5.client.dto.category;

import com.pbl5.common.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

public class CategoryDto {

    private Integer id;
    private String name;
    private String alias;
    private String image;
    public CategoryDto() {
    }

    public CategoryDto(Integer id, String name, String alias) {
        this.id = id;
        this.name = name;
        this.alias = alias;
    }

}
