import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createProject } from '../redux/slices/projectSlice';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    setSaving(true);
    try {
      await dispatch(createProject(formData)).unwrap();
      toast.success('Project created!');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="create-project-modal">
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
        className="relative bg-white rounded-xl shadow-modal w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h3 className="text-lg font-bold text-primary">Create Project</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-5">
          <div>
            <label htmlFor="project-name" className="label">Project Name</label>
            <input
              id="project-name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="input-field"
              placeholder="e.g. Marketing Campaign Q4"
            />
          </div>
          <div>
            <label htmlFor="project-desc" className="label">Description</label>
            <textarea
              id="project-desc"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Brief description of the project..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <FolderPlus size={14} />}
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
