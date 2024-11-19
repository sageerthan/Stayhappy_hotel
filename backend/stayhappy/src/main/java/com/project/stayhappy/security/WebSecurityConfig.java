package com.project.stayhappy.security;

import com.project.stayhappy.security.jwt.AuthTokenFilter;
import com.project.stayhappy.security.jwt.JwtAuthEntryPoint;
import com.project.stayhappy.security.user.HotelUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private HotelUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    /**
     * Defines the custom JWT token filter.
     */
    @Bean
    public AuthTokenFilter authenticationTokenFilter() {
        return new AuthTokenFilter();
    }

    /**
     * Configures the password encoder (BCrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the authentication provider to use the userDetailsService and password encoding.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Configures the authentication manager using the authentication configuration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

//    /**
//     * Removes the "ROLE_" prefix requirement for roles in Spring Security.
//     */
//    @Bean
//    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
//        return new GrantedAuthorityDefaults(""); // Disable "ROLE_" prefix.
//    }

    /**
     * Configures the security filter chain.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for JWT-based authentication.
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthEntryPoint)) // Custom auth entry point for unauthorized access.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless session management for JWT.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/rooms/**", "/bookings/**","/users/**").permitAll() // Publicly accessible endpoints.
                        .requestMatchers("/roles/**").hasRole("ADMIN") // Restrict "/roles/**" to ADMIN role.
                        .anyRequest().authenticated())// Require authentication for "/users/**".
                         // Default: all other endpoints require authentication..requestMatchers("/users/**").authenticated()
                .authenticationProvider(authenticationProvider()) // Register custom authentication provider.
                .addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class); // Add JWT token filter.

        return http.build();
    }
}
