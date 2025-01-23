package com.nus_iss.spring.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootTest
class BackendApplicationTests {

    static {
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.load();

        // Retrieve and check environment variables
        String dbHost = dotenv.get("DB_HOST");
        String dbUser = dotenv.get("DB_USERNAME");
        String dbPassword = dotenv.get("DB_PASSWORD");
        String secretKey = dotenv.get("SECRET_KEY");

        // Ensure variables are not null and set them as system properties
        if (dbHost == null || dbUser == null || dbPassword == null || secretKey == null) {
            throw new IllegalArgumentException("One or more environment variables are missing.");
        }

        System.setProperty("DB_HOST", dbHost);
        System.setProperty("DB_USERNAME", dbUser);
        System.setProperty("DB_PASSWORD", dbPassword);
        System.setProperty("SECRET_KEY", secretKey);
    }

    @Test
    void contextLoads() {
    }
}
