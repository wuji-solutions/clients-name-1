package com.wuji.backend.security.auth

import com.wuji.backend.player.NicknameGenerator
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.session.SessionRegistry
import org.springframework.stereotype.Service

@Service
class PlayerAuthService(private val sessionRegistry: SessionRegistry) {
    private val JOINED_ROLE = SimpleGrantedAuthority("JOINED")

    fun authenticate(index: Int, request: HttpServletRequest): Participant {
        val currentAuth = SecurityContextHolder.getContext().authentication
        if (currentAuth?.authorities?.contains(JOINED_ROLE) == true) {
            return currentAuth.principal as Participant
        }
        val nickname = NicknameGenerator.generateRandom()
        val participant = Participant(index, nickname)
        val auth = UsernamePasswordAuthenticationToken(participant, null, listOf(JOINED_ROLE))

        val securityContext = SecurityContextHolder.getContext()
        securityContext.authentication = auth

        val session = request.getSession(true)
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext)
        sessionRegistry.registerNewSession(session.id, participant)

        return participant
    }

    fun removeAuthentication(index: Int) {
        val principal = sessionRegistry.allPrincipals.find { (it as? Participant)?.index == index }
        if (principal != null) {
            sessionRegistry.getAllSessions(principal, false).forEach {
                sessionRegistry.removeSessionInformation(it.sessionId)
                it.expireNow()
            }
            sessionRegistry.allPrincipals.remove(principal)

        }
    }

}

data class Participant(val index: Int, val nickname: String)

fun Authentication.playerIndex() = (this.principal as Participant).index
