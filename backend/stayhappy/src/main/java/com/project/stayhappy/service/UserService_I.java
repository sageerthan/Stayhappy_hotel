package com.project.stayhappy.service;

import com.project.stayhappy.exception.UserAlreadyExistsException;
import com.project.stayhappy.model.User;

import java.util.List;

public interface UserService_I {
    User registerUser(User user) throws UserAlreadyExistsException;
    List<User> getAllUsers();
    void deleteUser(String email);

    User getUserByEmail(String email);
}
