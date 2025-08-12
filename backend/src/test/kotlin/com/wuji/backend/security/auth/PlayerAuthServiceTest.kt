package com.wuji.backend.security.auth

import com.wuji.backend.player.NicknameGenerator
import io.mockk.every
import io.mockk.mockkObject
import io.mockk.unmockkObject
import org.hamcrest.CoreMatchers.containsString
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpSession
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.session.SessionRegistry
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity

@SpringBootTest
class PlayerAuthServiceIntegrationTest {

    @Autowired
    private lateinit var playerAuthService: PlayerAuthService

    @Autowired
    private lateinit var sessionRegistry: SessionRegistry

    @Autowired
    private lateinit var context: WebApplicationContext

    private lateinit var mockMvc: MockMvc
    private lateinit var request: MockHttpServletRequest

    @BeforeEach
    fun setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply{springSecurity()}.build()
        request = MockHttpServletRequest()
        SecurityContextHolder.clearContext()
        mockkObject(NicknameGenerator)
    }

    @AfterEach
    fun tearDown() {
        SecurityContextHolder.clearContext()
        unmockkObject(NicknameGenerator)
        sessionRegistry.allPrincipals.forEach { principal ->
            sessionRegistry.getAllSessions(principal, false).forEach {
                sessionRegistry.removeSessionInformation(it.sessionId)
            }
        }
        sessionRegistry.allPrincipals.clear()
    }

    @Test
    fun `should block kicked-out user from accessing answer endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession
        playerAuthService.removeAuthentication(index)

        // Act & Assert
        mockMvc.post("/answer") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"answerIds": [1, 2]}"""
            session = rSession
        }.andExpect {
            status { is5xxServerError () }
            content { string(containsString("You are not logged in")) }
        }
        assertNull(SecurityContextHolder.getContext().authentication)
        assertNull(request.getSession(false))
        assertEquals(emptyList<Any>(), sessionRegistry.allPrincipals)
    }

    @Test
    fun `should block kicked-out user from accessing sse endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession
        playerAuthService.removeAuthentication(index)

        // Act & Assert
        mockMvc.post("/sse/game1/player1") {
            contentType = MediaType.APPLICATION_JSON
            session = rSession
        }.andExpect {
            status { is5xxServerError() }
            content { string(containsString("YOU WERE KICKED OUT XD")) }
        }
        assertNull(SecurityContextHolder.getContext().authentication)
        assertNull(request.getSession(false))
        assertEquals(emptyList<Any>(), sessionRegistry.allPrincipals)
    }

    @Test
    fun `should block kicked-out user from accessing games endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession
        playerAuthService.removeAuthentication(index)

        // Act & Assert
        mockMvc.post("/games/game1/action") {
            contentType = MediaType.APPLICATION_JSON
            session = rSession
        }.andExpect {
            status { is5xxServerError() }
            content { string(containsString("YOU WERE KICKED OUT XD")) }
        }
        assertNull(SecurityContextHolder.getContext().authentication)
        assertNull(request.getSession(false))
        assertEquals(emptyList<Any>(), sessionRegistry.allPrincipals)
    }

    @Test
    fun `should allow authenticated user to access answer endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession

        // Act & Assert
        mockMvc.post("/answer") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"answerIds": [1, 2]}"""
            session = rSession
        }.andExpect {
            status { isOk() }
        }
        assertNotNull(SecurityContextHolder.getContext().authentication)
        assertEquals(participant, SecurityContextHolder.getContext().authentication.principal)
        assertEquals(listOf(rSession.id), sessionRegistry.getAllSessions(participant, false).map { it.sessionId })
    }

    @Test
    fun `should allow authenticated user to access sse endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession

        // Act & Assert
        mockMvc.post("/sse/game1/player1") {
            contentType = MediaType.APPLICATION_JSON
            session = rSession
        }.andExpect {
            status { isOk() }
        }
        assertNotNull(SecurityContextHolder.getContext().authentication)
        assertEquals(participant, SecurityContextHolder.getContext().authentication.principal)
        assertEquals(listOf(rSession.id), sessionRegistry.getAllSessions(participant, false).map { it.sessionId })
    }

    @Test
    fun `should allow authenticated user to access games endpoint`() {
        // Arrange
        val index = 1
        every { NicknameGenerator.generateRandom() } returns "testPlayer"
        val participant = playerAuthService.authenticate(index, request)
        val rSession = request.session as MockHttpSession

        // Act & Assert
        mockMvc.post("/games/game1/action") {
            contentType = MediaType.APPLICATION_JSON
            session = rSession
        }.andExpect {
            status { isOk() }
        }
        assertNotNull(SecurityContextHolder.getContext().authentication)
        assertEquals(participant, SecurityContextHolder.getContext().authentication.principal)
        assertEquals(listOf(rSession.id), sessionRegistry.getAllSessions(participant, false).map { it.sessionId })
    }
}