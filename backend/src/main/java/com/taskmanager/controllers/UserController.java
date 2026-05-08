package com.taskmanager.controllers;

import com.taskmanager.dto.MessageResponse;
import com.taskmanager.models.Project;
import com.taskmanager.models.Task;
import com.taskmanager.models.User;
import com.taskmanager.repositories.ProjectRepository;
import com.taskmanager.repositories.TaskRepository;
import com.taskmanager.repositories.UserRepository;
import com.taskmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userRepository.findById(userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Permanently delete the current user's account.
     * Cleans up:
     * 1. Removes user from all project member lists.
     * 2. Unassigns their tasks.
     * 3. (Optional) Deletes projects they own (Admin only).
     */
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println("🗑️ DELETE request received for user: " + userDetails.getEmail());
        String userId = userDetails.getId();

        // 1. Unassign tasks assigned to this user
        List<Task> assignedTasks = taskRepository.findByAssignedTo(userId);
        for (Task task : assignedTasks) {
            task.setAssignedTo(null);
            task.setAssignedToName(null);
            taskRepository.save(task);
        }

        // 2. Remove from project memberships
        List<Project> memberProjects = projectRepository.findByMemberUserId(userId);
        for (Project project : memberProjects) {
            project.getMembers().removeIf(m -> m.getUserId().equals(userId));
            projectRepository.save(project);
        }

        // 3. If Admin, delete projects they own (to avoid orphaned projects)
        List<Project> ownedProjects = projectRepository.findByAdminId(userId);
        for (Project project : ownedProjects) {
            // Also delete tasks associated with these projects
            taskRepository.deleteByProjectId(project.getId());
            projectRepository.delete(project);
        }

        // 4. Finally, delete the user
        userRepository.deleteById(userId);

        return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
    }
}
