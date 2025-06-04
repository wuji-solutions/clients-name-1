package com.wuji.backend.security

import com.wuji.backend.player.NicknameGenerator
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import java.util.*


@Component
class ParticipantRegistrationFilter() : OncePerRequestFilter() {
    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val session = request.session // tworzy, jeśli brak
        if (session.getAttribute("participantId") == null) {
            val participantId = UUID.randomUUID().toString()
            println("Tworzymy nowego usera siuuuu $participantId")
            session.setAttribute("participantId", participantId)
            if (session.getAttribute("nickname") == null) {
                session.setAttribute("nickname", NicknameGenerator.generateRandom())
            }
        }
        filterChain.doFilter(request, response)
    }
}
