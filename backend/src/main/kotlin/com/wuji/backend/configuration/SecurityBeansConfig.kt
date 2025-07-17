package com.wuji.backend.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.wuji.backend.security.CustomAccessDeniedHandler
import com.wuji.backend.security.CustomAuthenticationEntryPoint
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.access.AccessDeniedHandler

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
}
