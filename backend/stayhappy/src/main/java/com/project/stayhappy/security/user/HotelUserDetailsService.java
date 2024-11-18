package com.project.stayhappy.security.user;

import com.project.stayhappy.model.User;
import com.project.stayhappy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class HotelUserDetailsService implements UserDetailsService{
          @Autowired
          UserRepository userRepository;

          public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
              User user=userRepository.findByEmail(email)
                      .orElseThrow(()->new UsernameNotFoundException("User not found"));
              return HotelUserDetails.buildUserDetails(user);
          }

}
