package com.wuji.backend.security.auth

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.session.SessionRegistry
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class SessionValidationFilter(
    private val sessionRegistry: SessionRegistry,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain
    ) {
        val auth = SecurityContextHolder.getContext().authentication
        if (auth?.principal is Participant) {
            val participant = auth.principal as Participant
            if (sessionRegistry.getAllSessions(participant, false).isEmpty()) {
                SecurityContextHolder.clearContext()
                val session = request.getSession(false)
                session?.invalidate()
                throw InsufficientAuthenticationException(
                    "You are not logged in")
            }
        }
        chain.doFilter(request, response)
    }
}
