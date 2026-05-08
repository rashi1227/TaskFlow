package com.taskmanager.config;

import com.taskmanager.models.*;
import com.taskmanager.repositories.ProjectRepository;
import com.taskmanager.repositories.TaskRepository;
import com.taskmanager.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no users exist yet
        if (userRepository.count() > 0) {
            System.out.println("📦 Database already has data — skipping seed.");
            return;
        }

        System.out.println("🌱 Seeding database with demo data...");

        // ── Create Users ─────────────────────────────
        User admin = new User();
        admin.setName("Alex Morgan");
        admin.setEmail("garvitsingh12@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setCreatedAt(new Date());
        admin = userRepository.save(admin);

        User admin2 = new User();
        admin2.setName("Jordan Reed");
        admin2.setEmail("admin12@gmail.com");
        admin2.setPassword(passwordEncoder.encode("admin123"));
        admin2.setRole(Role.ADMIN);
        admin2.setCreatedAt(new Date());
        admin2 = userRepository.save(admin2);

        User member1 = new User();
        member1.setName("Sarah Chen");
        member1.setEmail("sarah@taskflow.io");
        member1.setPassword(passwordEncoder.encode("member123"));
        member1.setRole(Role.MEMBER);
        member1.setCreatedAt(new Date());
        member1 = userRepository.save(member1);

        User member2 = new User();
        member2.setName("James Wilson");
        member2.setEmail("james@taskflow.io");
        member2.setPassword(passwordEncoder.encode("member123"));
        member2.setRole(Role.MEMBER);
        member2.setCreatedAt(new Date());
        member2 = userRepository.save(member2);

        User member3 = new User();
        member3.setName("Priya Sharma");
        member3.setEmail("priya@taskflow.io");
        member3.setPassword(passwordEncoder.encode("member123"));
        member3.setRole(Role.MEMBER);
        member3.setCreatedAt(new Date());
        member3 = userRepository.save(member3);

        // ── Project 1: Website Redesign ──────────────
        Project p1 = new Project();
        p1.setName("Website Redesign 2026");
        p1.setDescription("Complete overhaul of the corporate website with modern design system, improved UX, and mobile-first approach.");
        p1.setAdminId(admin.getId());
        p1.setAdminName(admin.getName());
        p1.setCreatedAt(daysAgo(14));
        p1.setMembers(List.of(
                new ProjectMember(admin.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member1.getId(), ProjectPermission.EDIT),
                new ProjectMember(member2.getId(), ProjectPermission.EDIT)
        ));
        p1 = projectRepository.save(p1);

        createTask(p1.getId(), "Design new homepage layout", "Create wireframes and high-fidelity mockups for the homepage", TaskPriority.HIGH, TaskStatus.DONE, member1.getId(), daysAgo(10), daysFromNow(5));
        createTask(p1.getId(), "Implement responsive navigation", "Build a mobile-first responsive navbar with hamburger menu", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, member2.getId(), daysAgo(7), daysFromNow(3));
        createTask(p1.getId(), "Set up CI/CD pipeline", "Configure GitHub Actions for automated testing and deployment", TaskPriority.MEDIUM, TaskStatus.TODO, member1.getId(), daysAgo(5), daysFromNow(7));
        createTask(p1.getId(), "Create component library", "Build reusable UI components: Button, Card, Modal, Input, Avatar", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, member1.getId(), daysAgo(6), daysFromNow(4));
        createTask(p1.getId(), "SEO optimization audit", "Run Lighthouse audit and fix all SEO issues", TaskPriority.LOW, TaskStatus.TODO, null, daysAgo(3), daysFromNow(14));
        createTask(p1.getId(), "Dark mode implementation", "Add theme toggle with CSS custom properties and localStorage persistence", TaskPriority.MEDIUM, TaskStatus.TODO, member2.getId(), daysAgo(2), daysFromNow(10));

        // ── Project 2: Mobile App MVP ────────────────
        Project p2 = new Project();
        p2.setName("Mobile App MVP");
        p2.setDescription("Build the first version of the TaskFlow mobile application for iOS and Android using React Native.");
        p2.setAdminId(admin.getId());
        p2.setAdminName(admin.getName());
        p2.setCreatedAt(daysAgo(7));
        p2.setMembers(List.of(
                new ProjectMember(admin.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member2.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member3.getId(), ProjectPermission.EDIT)
        ));
        p2 = projectRepository.save(p2);

        createTask(p2.getId(), "Set up React Native project", "Initialize project with Expo, configure navigation and state management", TaskPriority.HIGH, TaskStatus.DONE, member2.getId(), daysAgo(6), daysAgo(1));
        createTask(p2.getId(), "Build authentication screens", "Login, Register, and Forgot Password screens with form validation", TaskPriority.HIGH, TaskStatus.DONE, member3.getId(), daysAgo(5), daysFromNow(2));
        createTask(p2.getId(), "Design app icon and splash screen", "Create branded assets for both iOS and Android", TaskPriority.MEDIUM, TaskStatus.IN_PROGRESS, member3.getId(), daysAgo(3), daysFromNow(5));
        createTask(p2.getId(), "Implement push notifications", "Set up Firebase Cloud Messaging for task reminders", TaskPriority.HIGH, TaskStatus.TODO, member2.getId(), daysAgo(2), daysFromNow(8));
        createTask(p2.getId(), "Offline mode with local storage", "Cache tasks locally using AsyncStorage for offline access", TaskPriority.MEDIUM, TaskStatus.TODO, null, daysAgo(1), daysFromNow(12));

        // ── Project 3: Q3 Marketing Campaign ────────
        Project p3 = new Project();
        p3.setName("Q3 Marketing Campaign");
        p3.setDescription("Plan and execute the Q3 marketing strategy including social media, email campaigns, and content creation.");
        p3.setAdminId(admin.getId());
        p3.setAdminName(admin.getName());
        p3.setCreatedAt(daysAgo(3));
        p3.setMembers(List.of(
                new ProjectMember(admin.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member1.getId(), ProjectPermission.VIEW),
                new ProjectMember(member3.getId(), ProjectPermission.EDIT)
        ));
        p3 = projectRepository.save(p3);

        createTask(p3.getId(), "Draft social media calendar", "Plan 3 months of posts across LinkedIn, Twitter, and Instagram", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, member3.getId(), daysAgo(2), daysFromNow(3));
        createTask(p3.getId(), "Write blog post: Product Launch", "1500-word article announcing new features for the Q3 release", TaskPriority.MEDIUM, TaskStatus.TODO, member3.getId(), daysAgo(1), daysFromNow(7));
        createTask(p3.getId(), "Design email newsletter template", "Create responsive HTML email template matching brand guidelines", TaskPriority.LOW, TaskStatus.TODO, null, daysAgo(1), daysFromNow(10));
        createTask(p3.getId(), "Competitor analysis report", "Research top 5 competitors and summarize positioning differences", TaskPriority.HIGH, TaskStatus.TODO, member3.getId(), daysAgo(1), daysFromNow(5));

        // ── Project 4: API Integration Hub ───────────
        Project p4 = new Project();
        p4.setName("API Integration Hub");
        p4.setDescription("Develop third-party API integrations for Slack, Jira, and Google Calendar to enhance team productivity.");
        p4.setAdminId(admin.getId());
        p4.setAdminName(admin.getName());
        p4.setCreatedAt(daysAgo(1));
        p4.setMembers(List.of(
                new ProjectMember(admin.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member1.getId(), ProjectPermission.EDIT),
                new ProjectMember(member2.getId(), ProjectPermission.EDIT),
                new ProjectMember(member3.getId(), ProjectPermission.VIEW)
        ));
        p4 = projectRepository.save(p4);

        createTask(p4.getId(), "Slack webhook integration", "Send task notifications to Slack channels via incoming webhooks", TaskPriority.HIGH, TaskStatus.TODO, member1.getId(), daysAgo(1), daysFromNow(6));
        createTask(p4.getId(), "Google Calendar sync", "Two-way sync between task due dates and Google Calendar events", TaskPriority.MEDIUM, TaskStatus.TODO, member2.getId(), daysAgo(1), daysFromNow(10));
        createTask(p4.getId(), "Jira issue importer", "Bulk import Jira issues as tasks with status mapping", TaskPriority.LOW, TaskStatus.TODO, null, daysAgo(1), daysFromNow(14));
        createTask(p4.getId(), "API rate limiter middleware", "Implement token bucket rate limiting for all external API calls", TaskPriority.HIGH, TaskStatus.TODO, member1.getId(), daysAgo(1), daysFromNow(4));

        // ── Project 5: Enterprise Cloud Migration (For new Admin) ──
        Project p5 = new Project();
        p5.setName("Enterprise Cloud Migration");
        p5.setDescription("Migrating legacy on-premise infrastructure to AWS with auto-scaling and high availability.");
        p5.setAdminId(admin2.getId());
        p5.setAdminName(admin2.getName());
        p5.setCreatedAt(daysAgo(5));
        p5.setMembers(List.of(
                new ProjectMember(admin2.getId(), ProjectPermission.MANAGE),
                new ProjectMember(member1.getId(), ProjectPermission.EDIT),
                new ProjectMember(member3.getId(), ProjectPermission.EDIT)
        ));
        p5 = projectRepository.save(p5);

        createTask(p5.getId(), "AWS VPC Setup", "Configure public and private subnets across multiple availability zones", TaskPriority.HIGH, TaskStatus.DONE, member1.getId(), daysAgo(4), daysAgo(1));
        createTask(p5.getId(), "Database Migration", "Transfer production data from Oracle to AWS RDS PostgreSQL", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, member3.getId(), daysAgo(3), daysFromNow(4));
        createTask(p5.getId(), "Load Balancer Config", "Setup Application Load Balancer with SSL termination", TaskPriority.MEDIUM, TaskStatus.TODO, member1.getId(), daysAgo(1), daysFromNow(6));

        System.out.println("✅ Seed data created successfully!");
        System.out.println("   📧 Admin 1 login:  garvitsingh12@gmail.com / admin123");
        System.out.println("   📧 Admin 2 login:  admin12@gmail.com / admin123");
        System.out.println("   📧 Member login:   sarah@taskflow.io / member123");
        System.out.println("   📧 Member login:   james@taskflow.io / member123");
        System.out.println("   📧 Member login:   priya@taskflow.io / member123");
    }

    // ── Helpers ──────────────────────────────────────

    private void createTask(String projectId, String title, String description,
                            TaskPriority priority, TaskStatus status, String assignedTo,
                            Date createdAt, Date dueDate) {
        Task task = new Task();
        task.setProjectId(projectId);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(priority);
        task.setStatus(status);
        task.setAssignedTo(assignedTo);
        task.setCreatedAt(createdAt);
        task.setDueDate(dueDate);
        taskRepository.save(task);
    }

    private Date daysAgo(int days) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -days);
        return cal.getTime();
    }

    private Date daysFromNow(int days) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, days);
        return cal.getTime();
    }
}
