package com.nus_iss.spring.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

    @Bean
    public Dotenv dotenv() {
        try {
            return Dotenv.load();
        } catch (Exception e) {
            return Dotenv.configure().ignoreIfMissing().load();
        }
    }

    static {
        try {
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            System.setProperty("DB_HOST", dotenv.get("DB_HOST", "default_host"));
            System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME", "default_user"));
            System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD", "default_password"));
        } catch (Exception e) {
            // Log that .env file wasn't found but continuing
        }
    }
}
