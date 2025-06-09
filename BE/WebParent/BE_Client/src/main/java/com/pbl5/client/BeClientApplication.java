package com.pbl5.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "com.pbl5.common.entity")
@EnableScheduling
public class BeClientApplication {
	

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("YOUR_CLIENT_ID", dotenv.get("YOUR_CLIENT_ID"));
		System.setProperty("YOUR_CLIENT_SECRET",dotenv.get("YOUR_CLIENT_SECRET"));
		System.setProperty("BASE_URL_BACKEND", dotenv.get("BASE_URL_BACKEND"));
		System.setProperty("BASE_URL_FRONTEND", dotenv.get("BASE_URL_FRONTEND"));
		System.setProperty("AWS_ACCESS_KEY",dotenv.get("AWS_ACCESS_KEY"));
		System.setProperty("AWS_SECRET_KEY",dotenv.get("AWS_SECRET_KEY"));
		System.setProperty("AWS_BUCKET_NAME",dotenv.get("AWS_BUCKET_NAME"));
		System.setProperty("AWS_REGION",dotenv.get("AWS_REGION"));

		SpringApplication.run(BeClientApplication.class, args);
	}
}
