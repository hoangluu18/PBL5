package com.pbl5.client.bean;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SearchParam {

    private Integer categoryId;
    private List<Integer> brandIds = new ArrayList<>();
    private float minPrice;
    private float maxPrice;
    private int rating;
    private String sortOption;

    public SearchParam(){
        maxPrice = Integer.MAX_VALUE;
        sortOption = "newest";
    }
}
