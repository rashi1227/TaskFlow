import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ projectId, initialStatus, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: initialStatus || 'TODO',
    assignedTo: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (e) {
      console.error('Failed to load users');
    }
  };

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        projectId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };
      await api.post('/tasks', payload);
      toast.success('Task created!');
      onCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="create-task-modal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl shadow-modal w-full max-w-lg mx-4"
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h3 className="text-lg font-bold text-primary">Create Task</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-5">
          <div>
            <label htmlFor="task-title" className="label">Title</label>
            <input
              id="task-title"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
              className="input-field"
              placeholder="e.g. Design login page"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="label">Description</label>
            <textarea
              id="task-desc"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Optional description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="label">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={onChange}
                className="input-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-status" className="label">Status</label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={onChange}
                className="input-field"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-assignee" className="label">Assign To</label>
              <select
                id="task-assignee"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={onChange}
                className="input-field"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-due" className="label">Due Date</label>
              <input
                id="task-due"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
