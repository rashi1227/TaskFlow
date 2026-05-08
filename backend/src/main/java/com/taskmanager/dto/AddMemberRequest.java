package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AddMemberRequest {
    @NotBlank
    @Email
    private String email;

    private String permission; // VIEW, EDIT, MANAGE — defaults to EDIT

    public AddMemberRequest() {}

    public AddMemberRequest(String email, String permission) {
        this.email = email;
        this.permission = permission;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
}
