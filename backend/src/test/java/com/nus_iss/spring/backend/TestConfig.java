package com.nus_iss.spring.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@TestConfiguration
public class TestConfig {

    @Bean
    public Dotenv dotenv() {
        return Dotenv.load();
    }

    static {
        // Load environment variables in test environment
        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
    }
}
