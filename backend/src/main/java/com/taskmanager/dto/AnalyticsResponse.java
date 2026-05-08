package com.taskmanager.dto;

import java.util.Map;

public class AnalyticsResponse {
    private long totalTasks;
    private long todoCount;
    private long inProgressCount;
    private long doneCount;
    private long overdueCount;
    private Map<String, Long> tasksByUser;

    public AnalyticsResponse() {}

    public AnalyticsResponse(long totalTasks, long todoCount, long inProgressCount, long doneCount,
                             long overdueCount, Map<String, Long> tasksByUser) {
        this.totalTasks = totalTasks;
        this.todoCount = todoCount;
        this.inProgressCount = inProgressCount;
        this.doneCount = doneCount;
        this.overdueCount = overdueCount;
        this.tasksByUser = tasksByUser;
    }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getTodoCount() { return todoCount; }
    public void setTodoCount(long todoCount) { this.todoCount = todoCount; }

    public long getInProgressCount() { return inProgressCount; }
    public void setInProgressCount(long inProgressCount) { this.inProgressCount = inProgressCount; }

    public long getDoneCount() { return doneCount; }
    public void setDoneCount(long doneCount) { this.doneCount = doneCount; }

    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }

    public Map<String, Long> getTasksByUser() { return tasksByUser; }
    public void setTasksByUser(Map<String, Long> tasksByUser) { this.tasksByUser = tasksByUser; }
}
