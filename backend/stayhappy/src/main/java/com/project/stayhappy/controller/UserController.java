package com.project.stayhappy.controller;

import com.project.stayhappy.exception.UserNotFoundException;
import com.project.stayhappy.model.User;
import com.project.stayhappy.service.UserService_I;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService_I userService;
    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers(){
        List<User>users=userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/{email}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?>getUserByEmail(@PathVariable("email") String email){
        try{
            User user=userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        }catch(UserNotFoundException e){
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred in fetching");
        }
    }
    @DeleteMapping("/delete/{email}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #email==principal.username)")
    public ResponseEntity<String>deleteUser(@PathVariable String email){
        try{
            userService.deleteUser(email);
            return ResponseEntity.ok("User deleted successfully!");
        }catch(UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred in deleting");
        }
    }
}
