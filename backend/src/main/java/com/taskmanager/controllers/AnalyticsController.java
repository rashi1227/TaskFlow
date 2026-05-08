package com.taskmanager.controllers;

import com.taskmanager.dto.AnalyticsResponse;
import com.taskmanager.security.UserDetailsImpl;
import com.taskmanager.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        AnalyticsResponse analytics = analyticsService.getAnalytics(userDetails.getId());
        return ResponseEntity.ok(analytics);
    }
}
