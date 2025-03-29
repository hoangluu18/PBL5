package com.pbl5.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;


@SpringBootApplication
@EntityScan(basePackages = "com.pbl5.common.entity")
public final class BeClientApplication {
	

	public static void main(String[] args) {
		 SpringApplication.run(BeClientApplication.class, args);

	}
}
