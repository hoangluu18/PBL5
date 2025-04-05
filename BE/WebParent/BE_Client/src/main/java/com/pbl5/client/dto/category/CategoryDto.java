package com.pbl5.client.dto.category;

import com.pbl5.common.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDto {

    private Integer id;
    private String name;
    private String alias;

    public CategoryDto() {
    }

    public CategoryDto(Integer id, String name, String alias) {
        this.id = id;
        this.name = name;
        this.alias = alias;
    }

}
