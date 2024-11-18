package com.project.stayhappy.service;

import com.project.stayhappy.model.Role;
import com.project.stayhappy.model.User;

import java.util.List;

public interface RoleService_I {
    List<Role> getRoles();

    Role createRole(Role theRole);

    void deleteRole(Long id);
    Role findByName(String name);
    User removeUserFromRole(Long userId, Long roleId);
    User assignRoleToUser(Long userId, Long roleId);
    Role removeAllUsersFromRole(Long roleId);
}
