import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Clock, Loader2, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksByProject, updateTask } from '../redux/slices/taskSlice';
import toast from 'react-hot-toast';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';

const PRIORITY_STYLES = {
  HIGH: 'bg-danger-light text-danger-dark border-danger/20',
  MEDIUM: 'bg-warning-light text-warning-dark border-warning/20',
  LOW: 'bg-primary-50 text-primary-700 border-primary-200',
};

const STATUS_MAP = {
  TODO: { label: 'To Do', color: 'bg-slate-400' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-accent' },
  DONE: { label: 'Done', color: 'bg-success' },
};

// ── Sortable Task Card ────────────────────────────
const SortableTask = ({ task, onClick, canDrag }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(canDrag ? listeners : {})}
      onClick={() => onClick(task)}
      className={`p-4 bg-white rounded-lg border border-surface-border mb-2.5
        hover:shadow-card-hover hover:border-primary/20 transition-all duration-150 group
        ${canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
        ${isDragging ? 'shadow-modal ring-2 ring-accent/30' : ''}`}
    >
      <div className="flex justify-between items-start mb-2.5">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM}`}>
          {task.priority || 'MEDIUM'}
        </span>
        {!canDrag && (
          <Lock size={10} className="text-slate-300" />
        )}
      </div>
      <h4 className="font-semibold text-sm text-primary mb-1 leading-snug">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      )}
      
      <div className="flex justify-between items-center pt-2.5 border-t border-surface-border">
        {task.assignedToName ? (
          <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignedToName}`}>
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[8px] font-bold border border-accent/20">
              {task.assignedToName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-medium text-slate-500 truncate max-w-[80px]">
              {task.assignedToName}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-300 italic">Unassigned</span>
        )}
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Column ────────────────────────────
const KanbanColumn = ({ status, tasks, onTaskClick, onAddTask, canCreate, canDrag }) => {
  const config = STATUS_MAP[status];

  return (
    <div className="flex flex-col w-full min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">{config.label}</h3>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      <div className="flex-1 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 min-h-[400px] scrollbar-thin overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask key={task.id} task={task} onClick={onTaskClick} canDrag={canDrag} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

// ── Kanban Board ────────────────────────────
const KanbanBoard = ({ projectId, isAdmin, permission }) => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createTaskStatus, setCreateTaskStatus] = useState(null);

  // Permission checks
  const canManage = permission === 'MANAGE';
  const canEdit = permission === 'EDIT' || canManage;
  const isViewOnly = permission === 'VIEW';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProject(projectId));
    }
  }, [projectId, dispatch]);

  const handleDragEnd = async (event) => {
    if (isViewOnly) return;

    const { active, over } = event;
    if (!active || !over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overTask = tasks.find(t => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      const newStatus = overTask.status;

      // EDIT permission: can only update assigned tasks
      if (permission === 'EDIT' && activeTask.assignedTo !== user?.id) {
        toast.error('You can only move tasks assigned to you');
        return;
      }

      try {
        await dispatch(updateTask({
          id: activeTask.id,
          data: { ...activeTask, status: newStatus }
        })).unwrap();
        toast.success(`Moved to ${STATUS_MAP[newStatus].label}`);
      } catch (err) {
        toast.error(err || 'Failed to update task');
        dispatch(fetchTasksByProject(projectId));
      }
    }
  };

  const columns = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div id="kanban-board">
      {isViewOnly && (
        <div className="mb-4 px-4 py-2.5 bg-slate-50 border border-surface-border rounded-md flex items-center gap-2 text-xs text-slate-500">
          <Lock size={12} />
          <span>You have <strong>View Only</strong> access. Contact the project admin to request edit permissions.</span>
        </div>
      )}

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          {Object.entries(columns).map(([status, columnTasks]) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columnTasks}
              onTaskClick={setSelectedTask}
              onAddTask={(status) => setCreateTaskStatus(status)}
              canCreate={canManage}
              canDrag={canEdit}
            />
          ))}
        </DndContext>
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectId={projectId}
          permission={permission}
          currentUserId={user?.id}
          onClose={() => setSelectedTask(null)}
          onUpdated={() => {
            dispatch(fetchTasksByProject(projectId));
            setSelectedTask(null);
          }}
        />
      )}

      {createTaskStatus && canManage && (
        <CreateTaskModal
          projectId={projectId}
          initialStatus={createTaskStatus}
          onClose={() => setCreateTaskStatus(null)}
          onCreated={() => {
            dispatch(fetchTasksByProject(projectId));
            setCreateTaskStatus(null);
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
