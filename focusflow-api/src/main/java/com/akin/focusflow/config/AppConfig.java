package com.akin.focusflow.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

//timezone kontrolü
@Configuration
public class AppConfig {

    @PostConstruct
    public void init(){
        // Bu proje tamamen UTC çalışır, client’lar kendi zamanı içinde convert eder.
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
}
