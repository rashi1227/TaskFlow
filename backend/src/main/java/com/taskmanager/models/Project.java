package com.taskmanager.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "projects")
public class Project {
    @Id
    private String id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    @NotBlank(message = "Admin ID is required")
    private String adminId;

    private String adminName;

    private List<ProjectMember> members = new ArrayList<>();

    private Date createdAt;

    public Project() {}

    public Project(String id, String name, String description, String adminId, List<ProjectMember> members, Date createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.adminId = adminId;
        this.members = members != null ? members : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public List<ProjectMember> getMembers() { return members; }
    public void setMembers(List<ProjectMember> members) { this.members = members != null ? members : new ArrayList<>(); }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    // ── Helpers ──────────────────────────

    /**
     * Find a member by userId. Returns null if not found.
     */
    public ProjectMember findMember(String userId) {
        return members.stream()
                .filter(m -> m.getUserId().equals(userId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Check if a user is a member of this project (or the admin).
     */
    public boolean hasAccess(String userId) {
        return adminId.equals(userId) || findMember(userId) != null;
    }

    /**
     * Get a flat list of member user IDs (for convenience).
     */
    public List<String> getMemberIds() {
        return members.stream().map(ProjectMember::getUserId).toList();
    }
}
