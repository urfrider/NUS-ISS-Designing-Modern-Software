package com.nus_iss.spring.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load environment variables from .env file
		Dotenv dotenv = Dotenv.load();

		// Set system properties from .env variables
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("SECRET_KEY", dotenv.get("SECRET_KEY"));

		SpringApplication.run(BackendApplication.class, args);
	}

}
