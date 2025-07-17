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

@Configuration
@EnableMethodSecurity
class SecurityConfig(
    private val customAccessDeniedHandler: AccessDeniedHandler,
    private val customAuthenticationEntryPoint: AuthenticationEntryPoint
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
            }
            .anonymous(Customizer.withDefaults())
            .formLogin { it.disable() }
            .exceptionHandling {
                it.accessDeniedHandler(customAccessDeniedHandler)
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
            }
            .authorizeHttpRequests {
                it.requestMatchers(AntPathRequestMatcher("/manage/**"))
                    .permitLocalhost()
                    .requestMatchers(
                        AntPathRequestMatcher("/games/*/join", "POST"))
                    .permitAll()
                    .requestMatchers(AntPathRequestMatcher("/games/*/**"))
                    .hasAuthority("JOINED")
                    .requestMatchers(AntPathRequestMatcher("/swagger-ui/**"))
                    .permitLocalhost()
                    .requestMatchers(AntPathRequestMatcher("/v3/api-docs/**"))
                    .permitLocalhost()
                    .anyRequest()
                    .denyAll()
            }

        return http.build()
    }

    fun AuthorizeHttpRequestsConfigurer<*>.AuthorizedUrl.permitLocalhost():
        AuthorizeHttpRequestsConfigurer<
            *>.AuthorizationManagerRequestMatcherRegistry {
        return this.access(
            WebExpressionAuthorizationManager(
                "hasIpAddress('127.0.0.1') or hasIpAddress('::1')"))
    }
}
