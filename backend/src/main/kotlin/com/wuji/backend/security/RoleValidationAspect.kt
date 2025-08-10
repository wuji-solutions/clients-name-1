package com.wuji.backend.security

import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.server.ResponseStatusException

@Aspect
@Component
class RoleValidationAspect {

    @Around("@within(IsAdmin) || @annotation(IsAdmin)")
    fun checkLocalhost(joinPoint: ProceedingJoinPoint): Any {
        val attrs =
            RequestContextHolder.getRequestAttributes()
                as? ServletRequestAttributes
                ?: throw ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Missing Request Attributes")

        val remoteAddr = attrs.request.remoteAddr
        if (remoteAddr != "127.0.0.1" &&
            remoteAddr != "::1" &&
            remoteAddr != "0:0:0:0:0:0:0:1") {
            throw AccessDeniedException("This is only for admin and localhost")
        }

        return joinPoint.proceed()
    }
}

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class IsAdmin
