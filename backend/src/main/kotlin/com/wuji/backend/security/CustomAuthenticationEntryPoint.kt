package com.wuji.backend.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.wuji.backend.error.BasicErrorResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.time.LocalDateTime
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint

class CustomAuthenticationEntryPoint(private val objectMapper: ObjectMapper) :
    AuthenticationEntryPoint {

    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException
    ) {
        val responseError =
            BasicErrorResponse(
                HttpServletResponse.SC_UNAUTHORIZED,
                authException.message,
                LocalDateTime.now())

        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.contentType = "application/json"
        response.characterEncoding = "UTF-8"

        response.writer.write(objectMapper.writeValueAsString(responseError))
    }
}
