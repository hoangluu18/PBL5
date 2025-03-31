package com.pbl5.client.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDto {

    private String name;
    private String alias;

    public CategoryDto() {
    }

    public CategoryDto(String name, String alias) {
        this.name = name;
        this.alias = alias;
    }


}
