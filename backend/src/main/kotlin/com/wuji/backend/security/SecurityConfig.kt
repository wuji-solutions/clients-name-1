package com.wuji.backend.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer
import org.springframework.security.config.http.SessionCreationPolicy
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
    private val customAuthenticationEntryPoint: AuthenticationEntryPoint
) {

    private final val localhostAuthorized =
        listOf(
            AntPathRequestMatcher("/manage/**"),
            AntPathRequestMatcher("/v3/api-docs/**"),
            AntPathRequestMatcher("/swagger-ui/**"),
            AntPathRequestMatcher("/sse/*"),
        )

    private final val joinedAuthorized =
        listOf(
            AntPathRequestMatcher("/sse/*/*"),
            AntPathRequestMatcher("/games/*/**"))

    private final val publicAuthorized =
        listOf(AntPathRequestMatcher("/games/*/join", "POST"))

    private final val isLocalHostString =
        "hasIpAddress('127.0.0.1') or hasIpAddress('::1')"
    private final val isJoinedString = "hasAuthority('JOINED')"

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        corsConfigurationSource: CorsConfigurationSource
    ): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource) }
            .sessionManagement { sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
            }
            .anonymous(Customizer.withDefaults())
            .formLogin { it.disable() }
            .exceptionHandling {
                it.accessDeniedHandler(customAccessDeniedHandler)
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
            }
            .authorizeHttpRequests { it.anyRequest().permitAll() }

        return http.build()
    }

    private fun expressionMatcher(
        vararg args: String
    ): WebExpressionAuthorizationManager =
        WebExpressionAuthorizationManager(args.joinToString(separator = " or "))

    fun AuthorizeHttpRequestsConfigurer<
            *>.AuthorizationManagerRequestMatcherRegistry
            .authorizeLocalhostPaths():
            AuthorizeHttpRequestsConfigurer<
                    *>.AuthorizationManagerRequestMatcherRegistry {
        return apply {
            localhostAuthorized.forEach { matcher ->
                requestMatchers(matcher)
                    .access(expressionMatcher(isLocalHostString))
            }
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
