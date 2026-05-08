package com.taskmanager.models;

public class ProjectMember {
    private String userId;
    private ProjectPermission permission;

    public ProjectMember() {}

    public ProjectMember(String userId, ProjectPermission permission) {
        this.userId = userId;
        this.permission = permission;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public ProjectPermission getPermission() { return permission; }
    public void setPermission(ProjectPermission permission) { this.permission = permission; }
}
