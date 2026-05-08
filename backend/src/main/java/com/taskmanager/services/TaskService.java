package com.taskmanager.services;

import com.taskmanager.models.*;
import com.taskmanager.repositories.ProjectRepository;
import com.taskmanager.repositories.TaskRepository;
import com.taskmanager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectService projectService;

    /**
     * Get all tasks for a project (only if user has access).
     */
    public List<Task> getTasksByProjectId(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.hasAccess(userId)) {
            throw new RuntimeException("You don't have access to this project");
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        tasks.forEach(this::populateAssigneeName);
        return tasks;
    }

    private void populateAssigneeName(Task task) {
        if (task.getAssignedTo() != null && !task.getAssignedTo().isEmpty()) {
            userRepository.findById(task.getAssignedTo())
                    .ifPresent(u -> task.setAssignedToName(u.getName()));
        }
    }

    /**
     * Get tasks assigned to the current user.
     */
    public List<Task> getTasksByAssignee(String userId) {
        List<Task> tasks = taskRepository.findByAssignedTo(userId);
        tasks.forEach(this::populateAssigneeName);
        return tasks;
    }

    /**
     * Create a new task.
     * Requires MANAGE permission on the project (admin or MANAGE-level member).
     */
    public Task createTask(Task task, String userId) {
        Project project = projectRepository.findById(task.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectPermission perm = projectService.getUserPermission(task.getProjectId(), userId);
        if (perm != ProjectPermission.MANAGE) {
            throw new RuntimeException("You need MANAGE permission to create tasks in this project");
        }

        task.setCreatedAt(new Date());
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TODO);
        }

        Task saved = taskRepository.save(task);
        populateAssigneeName(saved);
        return saved;
    }

    /**
     * Update a task. Permission-aware:
     * - MANAGE: can edit all fields on any task
     * - EDIT: can edit all fields on tasks assigned to them (except reassigning)
     * - VIEW: cannot edit anything
     */
    public Task updateTask(String taskId, Task updatedTask, String userId) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        ProjectPermission perm = projectService.getUserPermission(existingTask.getProjectId(), userId);
        if (perm == null) {
            throw new RuntimeException("You don't have access to this project");
        }

        if (perm == ProjectPermission.VIEW) {
            throw new RuntimeException("VIEW permission does not allow editing tasks");
        }

        if (perm == ProjectPermission.MANAGE) {
            // Full edit including reassignment
            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setPriority(updatedTask.getPriority());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setAssignedTo(updatedTask.getAssignedTo());
            existingTask.setDueDate(updatedTask.getDueDate());
        } else if (perm == ProjectPermission.EDIT) {
            // EDIT: can edit all fields on tasks assigned to them, but cannot reassign
            if (existingTask.getAssignedTo() != null && existingTask.getAssignedTo().equals(userId)) {
                existingTask.setTitle(updatedTask.getTitle());
                existingTask.setDescription(updatedTask.getDescription());
                existingTask.setPriority(updatedTask.getPriority());
                existingTask.setStatus(updatedTask.getStatus());
                existingTask.setDueDate(updatedTask.getDueDate());
                // assignedTo stays unchanged — only MANAGE can reassign
            } else {
                throw new RuntimeException("You can only edit tasks assigned to you");
            }
        }

        Task saved = taskRepository.save(existingTask);
        populateAssigneeName(saved);
        return saved;
    }

    /**
     * Delete a task. Requires MANAGE permission.
     */
    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        ProjectPermission perm = projectService.getUserPermission(task.getProjectId(), userId);
        if (perm != ProjectPermission.MANAGE) {
            throw new RuntimeException("You need MANAGE permission to delete tasks");
        }

        taskRepository.deleteById(taskId);
    }
}
