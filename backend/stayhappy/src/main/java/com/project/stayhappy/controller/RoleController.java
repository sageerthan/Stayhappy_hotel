package com.project.stayhappy.controller;

import com.project.stayhappy.exception.RoleAlreadyExistException;
import com.project.stayhappy.model.Role;
import com.project.stayhappy.model.User;
import com.project.stayhappy.service.RoleService_I;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    RoleService_I roleService;
    @GetMapping("/all")
    public ResponseEntity<List<Role>> getAllRoles(){
        List<Role>roles=roleService.getRoles();
        return ResponseEntity.status(HttpStatus.FOUND).body(roles);
    }
    @PostMapping("/createNewRole")
    public ResponseEntity<String> createRole(@RequestBody Role theRole){
        try{
            roleService.createRole(theRole);
            return ResponseEntity.ok("New role created successfully");
        }catch(RoleAlreadyExistException ex){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable("roleId") Long roleId){
        roleService.deleteRole(roleId);
    }

    @PostMapping("/removeAllUsersFromRole/{roleId}")
    public Role removeAllUsersFromRole(@PathVariable("roleId") Long roleId){
        return roleService.removeAllUsersFromRole(roleId);
    }

    @PostMapping("/removeUserFromRole")
    public User removeUserFromRole(@RequestParam("userId") Long userId,
                                   @RequestParam("roleId") Long roleId){
        return roleService.removeUserFromRole(userId, roleId);
    }

    @PostMapping("/assignUserToRole")
    public User assignUserToRole(@RequestParam("userId") Long userId,
                                 @RequestParam("roleId") Long roleId){
        return roleService.assignRoleToUser(userId,roleId);
    }
}
