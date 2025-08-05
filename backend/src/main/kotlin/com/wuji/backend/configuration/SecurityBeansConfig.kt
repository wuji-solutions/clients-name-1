package com.wuji.backend.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.wuji.backend.security.CustomAccessDeniedHandler
import com.wuji.backend.security.CustomAuthenticationEntryPoint
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityBeansConfig {
    @Bean
    fun customAccessDeniedHandler(
        objectMapper: ObjectMapper
    ): AccessDeniedHandler {
        return CustomAccessDeniedHandler(objectMapper)
    }

    @Bean
    fun customAuthenticationEntryPoint(
        objectMapper: ObjectMapper
    ): AuthenticationEntryPoint {
        return CustomAuthenticationEntryPoint(objectMapper)
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins =
            listOf(
                "http://localhost:3000", "http://192.168.137.1:3000") // NOSONAR
        configuration.allowedMethods =
            listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
