package com.taskmanager.repositories;

import com.taskmanager.models.Task;
import com.taskmanager.models.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
    List<Task> findByAssignedTo(String userId);
    List<Task> findByProjectIdIn(List<String> projectIds);
    long countByStatus(TaskStatus status);
    long countByProjectIdIn(List<String> projectIds);
    long countByStatusAndProjectIdIn(TaskStatus status, List<String> projectIds);
    List<Task> findByDueDateBeforeAndStatusNot(Date date, TaskStatus status);
    List<Task> findByDueDateBeforeAndStatusNotAndProjectIdIn(Date date, TaskStatus status, List<String> projectIds);
    void deleteByProjectId(String projectId);
}
