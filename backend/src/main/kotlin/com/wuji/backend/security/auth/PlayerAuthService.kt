package com.wuji.backend.security.auth

import com.wuji.backend.player.NicknameGenerator
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class PlayerAuthService {
    private val JOINED_ROLE = SimpleGrantedAuthority("JOINED")

    fun authenticate(index: Int, request: HttpServletRequest): Participant {
        if (SecurityContextHolder.getContext().authentication.authorities.contains(JOINED_ROLE)) {
            return SecurityContextHolder.getContext().authentication.principal as Participant
        }
        val nickname = NicknameGenerator.generateRandom()

        val participant = Participant(index, nickname)
        val auth = UsernamePasswordAuthenticationToken(
            participant,
            null,
            listOf(JOINED_ROLE)
        )

        val securityContext = SecurityContextHolder.getContext()
        securityContext.authentication = auth


        val session = request.getSession(true)
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext)

        return participant
    }

}

data class Participant(val index: Int, val nickname: String)
