package com.taskmanager.controllers;

import com.taskmanager.dto.AddMemberRequest;
import com.taskmanager.dto.MessageResponse;
import com.taskmanager.models.Project;
import com.taskmanager.models.ProjectPermission;
import com.taskmanager.security.UserDetailsImpl;
import com.taskmanager.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Project> projects = projectService.getUserProjects(userDetails.getId());
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Project savedProject = projectService.createProject(project, userDetails.getId());
            return ResponseEntity.ok(savedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return projectService.getProjectById(id)
                .filter(p -> p.hasAccess(userDetails.getId()))
                .map(p -> ResponseEntity.ok((Object) p))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            projectService.deleteProject(id, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Project deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Invite a member to a project with a specific permission level.
     * Body: { "email": "...", "permission": "VIEW" | "EDIT" | "MANAGE" }
     */
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable String id, @RequestBody AddMemberRequest request,
                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Parse permission, default to EDIT
            ProjectPermission permission = ProjectPermission.EDIT;
            if (request.getPermission() != null) {
                try {
                    permission = ProjectPermission.valueOf(request.getPermission().toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Invalid permission. Use VIEW, EDIT, or MANAGE"));
                }
            }

            Project updated = projectService.addMember(id, request.getEmail(), permission, userDetails.getId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable String id, @PathVariable String userId,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Project updated = projectService.removeMember(id, userId, userDetails.getId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Update a member's permission level.
     * Body: { "permission": "VIEW" | "EDIT" | "MANAGE" }
     */
    @PutMapping("/{id}/members/{userId}")
    public ResponseEntity<?> updateMemberPermission(@PathVariable String id, @PathVariable String userId,
                                                     @RequestBody Map<String, String> body,
                                                     @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            String permStr = body.get("permission");
            if (permStr == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Permission is required"));
            }

            ProjectPermission permission;
            try {
                permission = ProjectPermission.valueOf(permStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid permission. Use VIEW, EDIT, or MANAGE"));
            }

            Project updated = projectService.updateMemberPermission(id, userId, permission, userDetails.getId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Get current user's permission level for a project.
     */
    @GetMapping("/{id}/permission")
    public ResponseEntity<?> getMyPermission(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ProjectPermission perm = projectService.getUserPermission(id, userDetails.getId());
        if (perm == null) {
            return ResponseEntity.status(403).body(new MessageResponse("No access to this project"));
        }
        return ResponseEntity.ok(Map.of("permission", perm.name()));
    }
}
