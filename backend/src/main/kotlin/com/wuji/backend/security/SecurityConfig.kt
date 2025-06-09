package com.wuji.backend.security
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.util.matcher.AntPathRequestMatcher


@Configuration
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
            }
            .anonymous(Customizer.withDefaults())
            .formLogin { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers(AntPathRequestMatcher("/games/*/join", "POST")).permitAll()
                    .requestMatchers(AntPathRequestMatcher("/games/*/**")).hasAuthority("JOINED")
                    .anyRequest().denyAll()
            }

        return http.build()
    }
}
