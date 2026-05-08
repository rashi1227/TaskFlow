package com.taskmanager.services;

import com.taskmanager.models.*;
import com.taskmanager.repositories.ProjectRepository;
import com.taskmanager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Stream;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all projects the user has access to (as admin or invited member).
     * Members only see projects they've been explicitly invited to.
     */
    public List<Project> getUserProjects(String userId) {
        List<Project> asAdmin = projectRepository.findByAdminId(userId);
        List<Project> asMember = projectRepository.findByMemberUserId(userId);

        // Merge and deduplicate
        Map<String, Project> projectMap = new LinkedHashMap<>();
        Stream.concat(asAdmin.stream(), asMember.stream())
                .forEach(p -> {
                    if (!projectMap.containsKey(p.getId())) {
                        userRepository.findById(p.getAdminId())
                                .ifPresent(admin -> p.setAdminName(admin.getName()));
                        projectMap.put(p.getId(), p);
                    }
                });

        return new ArrayList<>(projectMap.values());
    }

    /**
     * Create a new project. Only Admins can create projects.
     * The admin is automatically added as a MANAGE-level member.
     */
    public Project createProject(Project project, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only Admins can create projects");
        }

        project.setAdminId(userId);
        project.setAdminName(user.getName());
        project.setCreatedAt(new Date());

        // Add creator as MANAGE member
        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }
        if (project.findMember(userId) == null) {
            project.getMembers().add(new ProjectMember(userId, ProjectPermission.MANAGE));
        }

        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id).map(p -> {
            userRepository.findById(p.getAdminId())
                    .ifPresent(admin -> p.setAdminName(admin.getName()));
            return p;
        });
    }

    /**
     * Delete a project. Only the project's admin can delete it.
     */
    public void deleteProject(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getAdminId().equals(userId)) {
            throw new RuntimeException("Only the project admin can delete this project");
        }

        projectRepository.deleteById(projectId);
    }

    /**
     * Invite a member to a project with a specific permission level.
     * Only the project's admin can invite members.
     */
    public Project addMember(String projectId, String memberEmail, ProjectPermission permission, String requesterId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getAdminId().equals(requesterId)) {
            throw new RuntimeException("Only the project admin can invite members");
        }

        User member = userRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + memberEmail));

        // Check if already a member
        ProjectMember existing = project.findMember(member.getId());
        if (existing != null) {
            throw new RuntimeException("User is already a member of this project");
        }

        project.getMembers().add(new ProjectMember(member.getId(), permission));
        Project saved = projectRepository.save(project);
        userRepository.findById(saved.getAdminId()).ifPresent(admin -> saved.setAdminName(admin.getName()));
        return saved;
    }

    /**
     * Remove a member from a project. Only the project's admin can remove members.
     */
    public Project removeMember(String projectId, String memberUserId, String requesterId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getAdminId().equals(requesterId)) {
            throw new RuntimeException("Only the project admin can remove members");
        }

        if (memberUserId.equals(project.getAdminId())) {
            throw new RuntimeException("Cannot remove the project admin");
        }

        project.getMembers().removeIf(m -> m.getUserId().equals(memberUserId));
        Project saved = projectRepository.save(project);
        userRepository.findById(saved.getAdminId()).ifPresent(admin -> saved.setAdminName(admin.getName()));
        return saved;
    }

    /**
     * Update a member's permission level. Only the project's admin can do this.
     */
    public Project updateMemberPermission(String projectId, String memberUserId, ProjectPermission newPermission, String requesterId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getAdminId().equals(requesterId)) {
            throw new RuntimeException("Only the project admin can change permissions");
        }

        if (memberUserId.equals(project.getAdminId())) {
            throw new RuntimeException("Cannot change the admin's permission");
        }

        ProjectMember member = project.findMember(memberUserId);
        if (member == null) {
            throw new RuntimeException("User is not a member of this project");
        }

        member.setPermission(newPermission);
        Project saved = projectRepository.save(project);
        userRepository.findById(saved.getAdminId()).ifPresent(admin -> saved.setAdminName(admin.getName()));
        return saved;
    }

    /**
     * Get the permission level a user has in a specific project.
     * Returns MANAGE for the project admin, null if no access.
     */
    public ProjectPermission getUserPermission(String projectId, String userId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return null;

        if (project.getAdminId().equals(userId)) {
            return ProjectPermission.MANAGE;
        }

        ProjectMember member = project.findMember(userId);
        return member != null ? member.getPermission() : null;
    }
}
