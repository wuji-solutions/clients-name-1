package com.wuji.backend.security.auth

import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.core.StringContains.containsString
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.mock.web.MockHttpSession
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class PlayerAuthServiceHttpIntegrationTest
@Autowired
constructor(private val mockMvc: MockMvc) {

    @Test
    fun `POST to auth should create session and return participant`() {
        val result =
            mockMvc
                .post("/test-auth/1") {
                    contentType = MediaType.APPLICATION_JSON
                }
                .andReturn()

        val participantJson = result.response.contentAsString
        assertThat(participantJson).contains("\"index\":1")
        assertThat(participantJson).contains("nickname")

        val session = result.request.session as MockHttpSession
        val securityContext =
            session.getAttribute(
                HttpSessionSecurityContextRepository
                    .SPRING_SECURITY_CONTEXT_KEY) as SecurityContextImpl

        assertThat(securityContext.authentication.principal)
            .isInstanceOf(Participant::class.java)
    }

    @Test
    fun `auth twice in same session should reuse participant`() {
        val mSession = MockHttpSession()

        val first =
            mockMvc
                .post("/test-auth/2") {
                    contentType = MediaType.APPLICATION_JSON
                    session = mSession
                }
                .andReturn()
                .response
                .contentAsString

        val second =
            mockMvc
                .post("/test-auth/999") {
                    contentType = MediaType.APPLICATION_JSON
                    session = mSession
                }
                .andReturn()
                .response
                .contentAsString

        assertThat(first).isEqualTo(second)
    }

    @Test
    fun `DELETE should remove authentication`() {
        val mSession = MockHttpSession()

        // Authenticate first
        mockMvc.post("/test-auth/3") {
            contentType = MediaType.APPLICATION_JSON
            session = mSession
        }

        // Remove
        mockMvc
            .delete("/test-auth/3") { session = mSession }
            .andExpect { status { isOk() } }

        // Expect error
        mockMvc
            .get("/test-auth/authenticated") { session = mSession }
            .andExpect {
                status { is4xxClientError() }
                content { string(containsString("Your session is invalid")) }
            }

        assert(mSession.isInvalid)
    }
}
