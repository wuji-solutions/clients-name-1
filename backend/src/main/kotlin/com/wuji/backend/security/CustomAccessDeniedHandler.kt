package com.wuji.backend.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.wuji.backend.error.BasicErrorResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.time.LocalDateTime
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler

class CustomAccessDeniedHandler(private val objectMapper: ObjectMapper) :
    AccessDeniedHandler {
    override fun handle(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        accessDeniedException: AccessDeniedException?
    ) {
        if (response == null || accessDeniedException == null) {
            return
        }
        val responseError =
            BasicErrorResponse(
                HttpServletResponse.SC_FORBIDDEN,
                accessDeniedException.message,
                LocalDateTime.now())

        response.status = HttpServletResponse.SC_FORBIDDEN
        response.contentType = "application/json"
        response.characterEncoding = "UTF-8"

        response.writer.write(objectMapper.writeValueAsString(responseError))
    }
}
