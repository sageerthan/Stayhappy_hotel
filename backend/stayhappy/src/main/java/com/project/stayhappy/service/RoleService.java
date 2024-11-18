package com.project.stayhappy.service;

import com.project.stayhappy.exception.RoleAlreadyExistException;
import com.project.stayhappy.exception.UserAlreadyExistsException;
import com.project.stayhappy.exception.UserNotFoundException;
import com.project.stayhappy.model.Role;
import com.project.stayhappy.model.User;
import com.project.stayhappy.repository.RoleRepository;
import com.project.stayhappy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService implements RoleService_I{
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role theRole) {
        String roleName=theRole.getName().toUpperCase();
        Role role=new Role(roleName);
        if(roleRepository.existsByName(role)){
            throw new RoleAlreadyExistException(theRole.getName()+"role already exists");
        }
        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long roleId) {
        this.removeAllUsersFromRole(roleId);
    }

    @Override
    public Role findByName(String name) {
        return null;
    }

    @Override
    public User removeUserFromRole(Long userId, Long roleId) {
        Optional<User> user=userRepository.findById(userId);
        Optional<Role> role=roleRepository.findById(roleId);
        if(role.isPresent() && role.get().getUsers().contains(user.get())){
            role.get().removeUserFromRole(user.get());
            roleRepository.save(role.get());
            return user.get();
        }
        throw new UserNotFoundException("User not found");
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> user=userRepository.findById(userId);
        Optional<Role> role=roleRepository.findById(roleId);
        if(user.isPresent() && user.get().getRoles().contains(role.get())){
            throw new UserAlreadyExistsException(
                    user.get().getFirstName()+" is already assigned to the "+role.get().getName()+" role");
        }
        if(role.isPresent()){
            role.get().assignRoleToUser(user.get());
            roleRepository.save(role.get());
        }
        return user.get();
    }

    @Override
    public Role removeAllUsersFromRole(Long roleId) {
        Optional<Role>role=roleRepository.findById(roleId);
        role.get().removeAllUsersFromRole();

        return roleRepository.save(role.get());
    }
}
