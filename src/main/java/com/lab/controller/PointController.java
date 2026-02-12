package com.lab.controller;

import com.lab.dto.PointCheckRequest;
import com.lab.dto.PointCheckResponse;
import com.lab.entity.User;
import com.lab.service.PointService;
import com.lab.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointController {

    private final PointService pointService;
    private final UserService userService;

    @Autowired
    public PointController(PointService pointService, UserService userService) {
        this.pointService = pointService;
        this.userService = userService;
    }

    private User getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            throw new RuntimeException("User not authenticated");
        }
        String username = (String) session.getAttribute("username");
        return userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkPoint(@Valid @RequestBody PointCheckRequest request, HttpServletRequest httpRequest) {
        try {
            if (!isValidX(request.getX())) {
                return ResponseEntity.badRequest()
                        .body("X must be one of: -3, -2, -1, 0, 1, 2, 3, 4, 5");
            }
            if (request.getY() < -3 || request.getY() > 5) {
                return ResponseEntity.badRequest()
                        .body("Y must be between -3 and 5");
            }
            if (!isValidR(request.getR())) {
                return ResponseEntity.badRequest()
                        .body("R must be one of: -3, -2, -1, 0, 1, 2, 3, 4, 5");
            }
            if (request.getR() <= 0) {
                return ResponseEntity.badRequest()
                        .body("R must be greater than 0");
            }

            User user = getCurrentUser(httpRequest);
            PointCheckResponse response = pointService.checkPoint(
                    request.getX(), request.getY(), request.getR(), user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/check-click")
    public ResponseEntity<?> checkPointFromClick(@Valid @RequestBody PointCheckRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getX() == null || request.getX() < -3 || request.getX() > 5) {
                return ResponseEntity.badRequest()
                        .body("X must be between -3 and 5");
            }
            if (request.getY() == null || request.getY() < -3 || request.getY() > 5) {
                return ResponseEntity.badRequest()
                        .body("Y must be between -3 and 5");
            }
            if (!isValidR(request.getR())) {
                return ResponseEntity.badRequest()
                        .body("R must be one of: -3, -2, -1, 0, 1, 2, 3, 4, 5");
            }
            if (request.getR() <= 0) {
                return ResponseEntity.badRequest()
                        .body("R must be greater than 0");
            }

            User user = getCurrentUser(httpRequest);
            PointCheckResponse response = pointService.checkPoint(
                    request.getX(), request.getY(), request.getR(), user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing request: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit,
            HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            com.lab.dto.HistoryResponse history = pointService.getHistory(user, offset, limit);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearHistory(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            pointService.clearHistory(user);
            return ResponseEntity.ok("History cleared");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }
    }

    private boolean isValidX(Double x) {
        if (x == null) return false;
        double[] validValues = {-3, -2, -1, 0, 1, 2, 3, 4, 5};
        for (double val : validValues) {
            if (Math.abs(x - val) < 0.0001) {
                return true;
            }
        }
        return false;
    }

    private boolean isValidR(Double r) {
        if (r == null) return false;
        double[] validValues = {-3, -2, -1, 0, 1, 2, 3, 4, 5};
        for (double val : validValues) {
            if (Math.abs(r - val) < 0.0001) {
                return true;
            }
        }
        return false;
    }
}