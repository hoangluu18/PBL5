package com.pbl5.client.controller;


import com.pbl5.client.common.Constants;
import com.pbl5.client.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.pbl5.client.common.Constants.REVIEW_API_URI;

@RestController
@RequestMapping(REVIEW_API_URI)
@CrossOrigin(Constants.FE_URL)
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @GetMapping("/{pid}")
    public ResponseEntity<?> getReviews(@PathVariable("pid") Integer pid){
        return ResponseEntity.ok(reviewService.getReviews(pid));
    }



}
