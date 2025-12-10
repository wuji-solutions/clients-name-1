package com.wuji.backend.security

import com.wuji.backend.security.auth.SessionValidationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.session.SessionRegistry
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.security.web.access.expression.WebExpressionAuthorizationManager
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.cors.CorsConfigurationSource

@Configuration
@EnableMethodSecurity
class SecurityConfig(
    private val customAccessDeniedHandler: AccessDeniedHandler,
    private val customAuthenticationEntryPoint: AuthenticationEntryPoint,
) {

    private final val joinedAuthorized =
        listOf(
            AntPathRequestMatcher("/sse/board/new-state"),
            AntPathRequestMatcher("/games/*/**"),
            AntPathRequestMatcher("/security/session-status"),
        )

    private final val publicAuthorized =
        listOf(
            AntPathRequestMatcher("/games/*/join", "POST"),
            AntPathRequestMatcher("/sse/events"))

    private final val isLocalHostString =
        "hasIpAddress('127.0.0.1') or hasIpAddress('::1')"
    private final val isJoinedString = "hasAuthority('JOINED')"

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        corsConfigurationSource: CorsConfigurationSource,
        sessionRegistry: SessionRegistry,
    ): SecurityFilterChain {
        val sessionValidationFilter = SessionValidationFilter(sessionRegistry)

        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource) }
            .sessionManagement { sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                sm.sessionConcurrency { concurrency ->
                    concurrency.sessionRegistry(sessionRegistry)
                    concurrency.maximumSessions(1)
                }
            }
            .anonymous(Customizer.withDefaults())
            .formLogin { it.disable() }
            .exceptionHandling {
                it.accessDeniedHandler(customAccessDeniedHandler)
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
            }
            .addFilterBefore(
                sessionValidationFilter,
                org.springframework.security.web.context
                        .SecurityContextHolderFilter::class
                    .java)
            .authorizeHttpRequests {
                it.enablePublicPaths()
                    .authorizeJoinedPaths()
                    .authorizeLocalhost()
            }

        return http.build()
    }

    private fun expressionMatcher(
        vararg args: String
    ): WebExpressionAuthorizationManager =
        WebExpressionAuthorizationManager(args.joinToString(separator = " or "))

    fun AuthorizeHttpRequestsConfigurer<
        *>.AuthorizationManagerRequestMatcherRegistry
        .authorizeLocalhost():
        AuthorizeHttpRequestsConfigurer<
            *>.AuthorizationManagerRequestMatcherRegistry {
        return apply {
            anyRequest().access(expressionMatcher(isLocalHostString))
        }
    }

    fun AuthorizeHttpRequestsConfigurer<
        *>.AuthorizationManagerRequestMatcherRegistry
        .authorizeJoinedPaths():
        AuthorizeHttpRequestsConfigurer<
            *>.AuthorizationManagerRequestMatcherRegistry {
        return apply {
            joinedAuthorized.forEach { matcher ->
                requestMatchers(matcher)
                    .access(
                        expressionMatcher(isLocalHostString, isJoinedString))
            }
        }
    }

    fun AuthorizeHttpRequestsConfigurer<
        *>.AuthorizationManagerRequestMatcherRegistry
        .enablePublicPaths():
        AuthorizeHttpRequestsConfigurer<
            *>.AuthorizationManagerRequestMatcherRegistry {
        return apply {
            publicAuthorized.forEach { matcher ->
                requestMatchers(matcher).permitAll()
            }
        }
    }
}
