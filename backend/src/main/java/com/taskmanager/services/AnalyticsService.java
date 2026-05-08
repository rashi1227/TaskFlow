package com.taskmanager.services;

import com.taskmanager.dto.AnalyticsResponse;
import com.taskmanager.models.Project;
import com.taskmanager.models.Task;
import com.taskmanager.models.TaskStatus;
import com.taskmanager.models.User;
import com.taskmanager.repositories.ProjectRepository;
import com.taskmanager.repositories.TaskRepository;
import com.taskmanager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AnalyticsService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get analytics for all projects the user has access to.
     */
    public AnalyticsResponse getAnalytics(String userId) {
        List<Project> asAdmin = projectRepository.findByAdminId(userId);
        List<Project> asMember = projectRepository.findByMemberUserId(userId);

        Map<String, Project> projectMap = new LinkedHashMap<>();
        Stream.concat(asAdmin.stream(), asMember.stream())
                .forEach(p -> projectMap.putIfAbsent(p.getId(), p));

        List<String> projectIds = new ArrayList<>(projectMap.keySet());

        if (projectIds.isEmpty()) {
            return new AnalyticsResponse(0, 0, 0, 0, 0, new HashMap<>());
        }

        List<Task> allTasks = taskRepository.findByProjectIdIn(projectIds);

        long totalTasks = allTasks.size();
        long todoCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        long inProgressCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long doneCount = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();

        Date now = new Date();
        long overdueCount = allTasks.stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().before(now)
                        && t.getStatus() != TaskStatus.DONE)
                .count();

        Map<String, Long> tasksByUserId = allTasks.stream()
                .filter(t -> t.getAssignedTo() != null && !t.getAssignedTo().isEmpty())
                .collect(Collectors.groupingBy(Task::getAssignedTo, Collectors.counting()));

        Map<String, Long> tasksByUser = new LinkedHashMap<>();
        for (Map.Entry<String, Long> entry : tasksByUserId.entrySet()) {
            String userName = userRepository.findById(entry.getKey())
                    .map(User::getName)
                    .orElse("Unknown User");
            tasksByUser.put(userName, entry.getValue());
        }

        return new AnalyticsResponse(totalTasks, todoCount, inProgressCount, doneCount, overdueCount, tasksByUser);
    }
}
