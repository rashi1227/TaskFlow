import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, deleteProject } from '../redux/slices/projectSlice';
import toast from 'react-hot-toast';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsHub = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        toast.success('Project deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete project');
      }
    }
  };

  return (
    <div className="pb-10" id="projects-hub">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track your team's projects.</p>
        </div>
        {isAdmin && (
          <button
            id="create-project-btn"
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-16">
          <h3 className="text-lg font-bold text-primary mb-2">No projects yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            {isAdmin ? 'Create your first project to get started.' : 'You haven\'t been added to any projects yet.'}
          </p>
          {isAdmin && (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={project.id}
              className="card group relative hover:border-primary/30 transition-all duration-200"
            >
              {isAdmin && project.adminId === user.id && (
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(project.id); }}
                  className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:bg-danger-light hover:text-danger transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <Link to={`/dashboard/projects/${project.id}`} className="block">
                <h3 className="text-base font-bold text-primary mb-1.5 group-hover:text-accent transition-colors pr-8">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 mb-1 line-clamp-2 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
                <p className="text-[11px] font-medium text-slate-400 mb-4 italic">
                  Managed by {project.adminId === user.id ? 'you' : project.adminName || 'Admin'}
                </p>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-surface-border">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={13} />
                    <span>{project.members?.length || 0} members</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default ProjectsHub;
