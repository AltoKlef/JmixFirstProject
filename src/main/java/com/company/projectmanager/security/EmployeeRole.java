package com.company.projectmanager.security;

import com.company.projectmanager.entity.*;
import io.jmix.security.model.EntityPolicyAction;
import io.jmix.security.role.annotation.EntityPolicy;
import io.jmix.security.role.annotation.ResourceRole;
import io.jmix.securityflowui.role.annotation.MenuPolicy;
import io.jmix.securityflowui.role.annotation.ViewPolicy;

@ResourceRole(name = "EmployeeRole", code = EmployeeRole.CODE)
public interface EmployeeRole {
    String CODE = "employee-role";

    @EntityPolicy(entityClass = Project.class, actions = EntityPolicyAction.READ)
    void project();

    @EntityPolicy(entityClass = ProjectStats.class, actions = EntityPolicyAction.READ)
    void projectStats();

    @EntityPolicy(entityClass = Task.class, actions = {EntityPolicyAction.UPDATE, EntityPolicyAction.READ, EntityPolicyAction.CREATE})
    void task();

    @EntityPolicy(entityClass = TimeEntry.class, actions = {EntityPolicyAction.CREATE, EntityPolicyAction.READ})
    void timeEntry();

    @EntityPolicy(entityClass = User.class, actions = EntityPolicyAction.READ)
    void user();

    @MenuPolicy(menuIds = {"User.list", "TimeEntry.list", "Task_.list", "ProjectStats.list", "Project.list"})
    @ViewPolicy(viewIds = {"User.list", "TimeEntry.list", "Task_.detail", "Task_.list", "ProjectStats.list", "Project.list", "Project.detail"})
    void screens();
}