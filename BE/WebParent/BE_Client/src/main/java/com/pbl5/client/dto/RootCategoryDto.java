package com.pbl5.client.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RootCategoryDto {

    private Integer id;
    private String name;
    private String alias;
    private String image;

    public RootCategoryDto() {
    }

    public RootCategoryDto(Integer id, String name, String alias, String image) {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.image = image;
    }
}
