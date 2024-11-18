/*package com.project.stayhappy.security;

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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private HotelUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    // Creates and returns an instance of AuthTokenFilter, which handles JWT token validation.
    @Bean
    public AuthTokenFilter authenticationTokenFilter() {
        return new AuthTokenFilter();
    }

    // Creates and returns an instance of BCryptPasswordEncoder, which is used to encode passwords securely
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Sets up DaoAuthenticationProvider with userDetailsService and passwordEncoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Sets up AuthenticationManager from the provided AuthenticationConfiguration
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Configures HttpSecurity to disable CSRF, set session policy, and set up authorization rules
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disables CSRF (needed for stateless JWT auth)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint)) // Sets custom auth entry point for unauthorized access
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sets stateless session policy (JWT auth)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/rooms/**","/bookings/**").permitAll() // Permits access to "/auth/**" and "/rooms/**" endpoints without authentication
                        .requestMatchers("/users/**").authenticated()
                        .requestMatchers("/roles/**").hasRole("ADMIN") // Restricts "/roles/**" to users with ADMIN role
                        .anyRequest().authenticated() // Requires authentication for all other endpoints
                );

        // Adds the custom authentication provider to support custom UserDetailsService and password encoding
        http.authenticationProvider(authenticationProvider());

        // Adds AuthTokenFilter before UsernamePasswordAuthenticationFilter to intercept requests for JWT validation
        http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}*/

/*package com.project.stayhappy.security;

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
    private  HotelUserDetailsService userDetailsService;

    @Autowired
    private  JwtAuthEntryPoint jwtAuthEntryPoint;

    //    Creates and returns an instance of AuthTokenFilter, which handles JWT token validation.
    @Bean
    public AuthTokenFilter authenticationTokenFilter(){
        return new AuthTokenFilter();
    }

    //    Creates and returns an instance of BCryptPasswordEncoder, which is used to encode passwords securely
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //    @Bean public DaoAuthenticationProvider authenticationProvider(): Configures the authentication provider, which uses HotelUserDetailsService to
//    load user details and BCryptPasswordEncoder to check passwords.
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer :: disable)
                .exceptionHandling(
                        exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**", "/rooms/**","/bookings/**").permitAll()
                        .requestMatchers("/roles/**").hasRole("ADMIN")
                        .anyRequest().authenticated());
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}*/

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
