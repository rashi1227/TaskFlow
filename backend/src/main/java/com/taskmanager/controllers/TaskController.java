package com.taskmanager.controllers;

import com.taskmanager.dto.MessageResponse;
import com.taskmanager.models.Task;
import com.taskmanager.security.UserDetailsImpl;
import com.taskmanager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTasksByProject(@PathVariable String projectId,
                                                @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Task> tasks = taskService.getTasksByProjectId(projectId, userDetails.getId());
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getTasksByAssignee(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Task createdTask = taskService.createTask(task, userDetails.getId());
            return ResponseEntity.ok(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable String id, @RequestBody Task task,
                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, task, userDetails.getId());
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            taskService.deleteTask(id, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Task deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
