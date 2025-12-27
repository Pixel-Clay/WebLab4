package com.lab.controller;

import com.lab.dto.LoginRequest;
import com.lab.dto.LoginResponse;
import com.lab.entity.User;
import com.lab.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new LoginResponse(false, "Username is required"));
            }
            if (request.getPassword() == null || request.getPassword().length() < 3) {
                return ResponseEntity.badRequest()
                        .body(new LoginResponse(false, "Password must be at least 3 characters"));
            }

            User user = userService.registerUser(request.getUsername().trim(), request.getPassword());
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("user", user);
            session.setAttribute("username", user.getUsername());
            
            return ResponseEntity.ok(new LoginResponse(true, "Registration successful", user.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new LoginResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        boolean isValid = userService.validateCredentials(request.getUsername(), request.getPassword());
        
        if (isValid) {
            User user = userService.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("user", user);
            session.setAttribute("username", user.getUsername());
            
            return ResponseEntity.ok(new LoginResponse(true, "Login successful", user.getUsername()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid username or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }

    @GetMapping("/check")
    public ResponseEntity<LoginResponse> checkAuth(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("username") != null) {
            String username = (String) session.getAttribute("username");
            return ResponseEntity.ok(new LoginResponse(true, "Authenticated", username));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(false, "Not authenticated"));
    }
}


