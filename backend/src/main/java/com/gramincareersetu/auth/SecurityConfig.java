package com.gramincareersetu.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gramincareersetu.common.ApiResponse;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthConverter jwtAuthConverter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper;

    @Value("${spring.h2.console.enabled:false}")
    private boolean h2ConsoleEnabled;

    @Autowired
    public SecurityConfig(
            JwtAuthConverter jwtAuthConverter,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            ObjectMapper objectMapper
    ) {
        this.jwtAuthConverter = jwtAuthConverter;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.objectMapper = objectMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            ApiResponse<Void> body = ApiResponse.error("Authentication required: " + authException.getMessage());
                            objectMapper.writeValue(response.getOutputStream(), body);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            ApiResponse<Void> body = ApiResponse.error("Access is denied: " + accessDeniedException.getMessage());
                            objectMapper.writeValue(response.getOutputStream(), body);
                        })
                )
                .authorizeHttpRequests(auth -> {
                    // Actuator health probes and public info
                    auth.requestMatchers("/actuator/health/liveness", "/actuator/health/readiness", "/actuator/info").permitAll();
                    auth.requestMatchers("/actuator/**").hasAnyRole("ADMIN", "SUPER_ADMIN");

                    // Only permit H2 console if explicitly enabled via properties in non-production
                    if (h2ConsoleEnabled) {
                        auth.requestMatchers("/h2-console/**").permitAll();
                    }

                    // Native Authentication endpoints
                    auth.requestMatchers("/api/v1", "/api/v1/").permitAll();
                    auth.requestMatchers("/api/v1/auth/**").permitAll();

                    // OpenAPI / Swagger UI
                    auth.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
                    // Reading public career information needs no account.
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/workshops/**").permitAll();

                    // These two store nothing that identifies a person, so they
                    // stay open; the rate limiter bounds abuse.
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/resumes/calculate-ats").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/quiz/submit").permitAll();

                    // Anything that WRITES a person's name, phone or village now
                    // requires a signed-in user.
                    //
                    // These three were permitAll. /jobs/*/apply accepted a name,
                    // phone and village from anyone, and /workshops/*/cancel
                    // identified the registrant by phone number alone — so
                    // guessing a number cancelled a real student's place.
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/jobs/*/apply").authenticated();
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/workshops/*/register").authenticated();
                    auth.requestMatchers(HttpMethod.POST, "/api/v1/workshops/*/cancel").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/scholarships/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/schemes/**").permitAll();
                    auth.requestMatchers("/api/v1/public/**").permitAll();

                    // Admin endpoints (including Volunteer dashboard stats)
                    auth.requestMatchers("/api/v1/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN", "VOLUNTEER");

                    // Any other endpoint requires authentication
                    auth.anyRequest().authenticated();
                })
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter))
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            ApiResponse<Void> body = ApiResponse.error("Authentication required: " + authException.getMessage());
                            objectMapper.writeValue(response.getOutputStream(), body);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            ApiResponse<Void> body = ApiResponse.error("Access is denied: " + accessDeniedException.getMessage());
                            objectMapper.writeValue(response.getOutputStream(), body);
                        })
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]",
                "https://*.gramincareersetu.org"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Idempotency-Key"));
        configuration.setExposedHeaders(List.of("X-Total-Count"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public org.springframework.security.oauth2.server.resource.web.BearerTokenResolver bearerTokenResolver(JwtTokenService jwtTokenService) {
        org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver resolver =
                new org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver();
        return request -> {
            String token = resolver.resolve(request);
            if (token != null && jwtTokenService.validateToken(token)) {
                // Handled natively by JwtAuthenticationFilter; skip Keycloak Resource Server filter
                return null;
            }
            return token;
        };
    }
}
