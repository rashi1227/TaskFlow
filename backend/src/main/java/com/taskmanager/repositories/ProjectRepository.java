package com.taskmanager.repositories;

import com.taskmanager.models.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByAdminId(String adminId);

    @Query("{'members.userId': ?0}")
    List<Project> findByMemberUserId(String userId);
}
