package com.wuji.backend.error

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(Exception::class)
    fun handleException(
        request: HttpServletRequest,
        ex: Exception
    ): ResponseEntity<ErrorResponse> {
        println("Caught exception: ${ex.javaClass.name} -> ${ex.message}")
        val responseStatus =
            ex.javaClass.getAnnotation(ResponseStatus::class.java)?.value ?: HttpStatus.INTERNAL_SERVER_ERROR
        val errorResponse = BasicErrorResponse(responseStatus.value(), ex.localizedMessage, LocalDateTime.now())
        return ResponseEntity.status(responseStatus).body(errorResponse)
    }
}