package com.taskmanager.models;

public enum ProjectPermission {
    VIEW,    // Can only view the project and its tasks
    EDIT,    // Can view + update status of tasks assigned to them
    MANAGE   // Can view + create/edit/delete any task in the project
}
