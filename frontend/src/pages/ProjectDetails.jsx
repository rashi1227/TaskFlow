import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Loader2, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveProject } from '../redux/slices/projectSlice';
import api from '../services/api';
import KanbanBoard from './KanbanBoard';
import MemberManager from '../components/MemberManager';

const PERM_LABELS = {
  MANAGE: { label: 'Manage', color: 'bg-accent/10 text-accent' },
  EDIT: { label: 'Edit', color: 'bg-warning-light text-warning-dark' },
  VIEW: { label: 'View Only', color: 'bg-slate-100 text-slate-500' },
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [project, setProject] = useState(null);
  const [myPermission, setMyPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  useEffect(() => {
    fetchProject();
    fetchPermission();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
      dispatch(setActiveProject(response.data));
    } catch (error) {
      navigate('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermission = async () => {
    try {
      const response = await api.get(`/projects/${id}/permission`);
      setMyPermission(response.data.permission);
    } catch (error) {
      setMyPermission(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!project) return null;

  const isProjectAdmin = project.adminId === user?.id;
  const canManage = myPermission === 'MANAGE';
  const canEdit = myPermission === 'EDIT' || canManage;
  const permStyle = PERM_LABELS[myPermission] || PERM_LABELS.VIEW;

  return (
    <div className="h-full flex flex-col pb-6" id="project-details">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-500" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-primary">{project.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${permStyle.color}`}>
                <Shield size={10} className="inline mr-1 -mt-0.5" />
                {permStyle.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="btn-secondary flex items-center gap-1.5 !text-xs !py-2"
          >
            <Users size={14} /> Team ({project.members?.length || 0})
          </button>
        </div>
      </div>

      {/* Member Manager Panel */}
      {showMembers && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <MemberManager
            project={project}
            isAdmin={isProjectAdmin}
            onUpdate={(updatedProject) => {
              setProject(updatedProject);
              dispatch(setActiveProject(updatedProject));
            }}
          />
        </motion.div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-surface-border mb-6">
        {['board', 'list'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'board' && (
          <KanbanBoard
            projectId={id}
            isAdmin={isProjectAdmin}
            permission={myPermission}
          />
        )}
        {activeTab === 'list' && (
          <div className="card">
            <p className="text-sm text-slate-500">List view coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
