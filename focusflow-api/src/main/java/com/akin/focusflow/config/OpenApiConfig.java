package com.akin.focusflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//Swagger’ın başlık, açıklama, versiyon gibi meta bilgilerini düzeltir.
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("FocusFlow API")
                        .version("1.0.0")
                        .description("Personal productivity, tasks and time-blocking backend service"));
    }
}