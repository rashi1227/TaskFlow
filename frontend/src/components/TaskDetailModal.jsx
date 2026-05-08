import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Save, Loader2, Lock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TaskDetailModal = ({ task, projectId, permission, currentUserId, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: task.title || '', description: task.description || '',
    priority: task.priority || 'MEDIUM', status: task.status || 'TODO',
    assignedTo: task.assignedTo || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canManage = permission === 'MANAGE';
  const isAssignee = task.assignedTo === currentUserId;
  // EDIT users can edit all fields on tasks assigned to them
  const canEditFields = canManage || (permission === 'EDIT' && isAssignee);
  const canReassign = canManage; // only MANAGE can change the assignee
  const canDelete = canManage;
  const isViewOnly = !canEditFields;

  useEffect(() => {
    if (canManage) api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const onChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true);
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        title: canEditFields ? formData.title : task.title,
        description: canEditFields ? formData.description : task.description,
        priority: canEditFields ? formData.priority : task.priority,
        status: canEditFields ? formData.status : task.status,
        assignedTo: canReassign ? (formData.assignedTo || null) : task.assignedTo,
        dueDate: canEditFields && formData.dueDate ? new Date(formData.dueDate).toISOString() : task.dueDate,
      });
      toast.success('Task updated');
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Task deleted');
      onUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const disabledCls = "input-field disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="task-detail-modal">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl shadow-modal w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-primary">Task Details</h3>
            {isViewOnly && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                <Lock size={9} /> Read Only
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-5 space-y-5">
          <div>
            <label className="label">Title</label>
            <input name="title" value={formData.title} onChange={onChange}
              disabled={!canEditFields} className={disabledCls} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={formData.description} onChange={onChange}
              disabled={!canEditFields} rows={3} className={disabledCls + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={formData.priority} onChange={onChange}
                disabled={!canEditFields} className={disabledCls}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={formData.status} onChange={onChange}
                disabled={!canEditFields} className={disabledCls}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Assigned To</label>
              {canReassign ? (
                <select name="assignedTo" value={formData.assignedTo} onChange={onChange}
                  className={disabledCls}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              ) : (
                <div className={disabledCls + " flex items-center gap-2"}>
                  {task.assignedToName ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">
                        {task.assignedToName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{task.assignedToName}</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={onChange}
                disabled={!canEditFields} className={disabledCls} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-surface-border bg-slate-50/50 rounded-b-xl">
          {canDelete ? (
            <button onClick={onDelete} disabled={deleting}
              className="btn-danger !py-2 flex items-center gap-1.5 !text-xs">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
            </button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary !py-2 !text-xs">Cancel</button>
            {canEditFields && (
              <button onClick={onSave} disabled={saving}
                className="btn-primary !py-2 flex items-center gap-1.5 !text-xs">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
