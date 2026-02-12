package com.lab.config;

import com.lab.entity.User;
import com.lab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            User admin = new User("admin", encoder.encode("admin"));
            userRepository.save(admin);
            System.out.println("Created test user: admin / admin");
        }
        
        if (!userRepository.existsByUsername("user")) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            User user = new User("user", encoder.encode("user"));
            userRepository.save(user);
            System.out.println("Created test user: user / user");
        }
    }
}


