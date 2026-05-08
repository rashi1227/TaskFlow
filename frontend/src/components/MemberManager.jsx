import React, { useState, useEffect } from 'react';
import { UserPlus, X, Loader2, Shield } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PERM_OPTIONS = [
  { value: 'VIEW', label: 'View Only', desc: 'Can only view tasks' },
  { value: 'EDIT', label: 'Edit', desc: 'Can update assigned task status' },
  { value: 'MANAGE', label: 'Manage', desc: 'Full task CRUD access' },
];

const PERM_BADGES = {
  MANAGE: 'bg-accent/10 text-accent',
  EDIT: 'bg-warning-light text-warning-dark',
  VIEW: 'bg-slate-100 text-slate-500',
};

const MemberManager = ({ project, isAdmin, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('EDIT');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchMembers(); }, [project.members]);

  const fetchMembers = async () => {
    try {
      const allUsers = await api.get('/users');
      const projectMembers = (project.members || []).map(m => {
        const u = allUsers.data.find(u => u.id === m.userId);
        return u ? { ...u, permission: m.permission } : null;
      }).filter(Boolean);
      setMembers(projectMembers);
    } catch (e) { console.error('Failed to load members'); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await api.post(`/projects/${project.id}/members`, { email, permission });
      toast.success(`Invited with ${permission} permission`);
      setEmail(''); onUpdate(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to invite'); }
    finally { setAdding(false); }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      const res = await api.delete(`/projects/${project.id}/members/${userId}`);
      toast.success('Member removed'); onUpdate(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to remove'); }
  };

  const handlePermChange = async (userId, newPerm) => {
    try {
      const res = await api.put(`/projects/${project.id}/members/${userId}`, { permission: newPerm });
      toast.success('Permission updated'); onUpdate(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  return (
    <div className="card" id="member-manager">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
          <Shield size={14}/> Team Members & Permissions
        </h3>
        <p className="text-[11px] text-slate-500">
          Admin: <span className="font-bold text-primary">{project.adminName || 'Loading...'}</span>
        </p>
      </div>

      {isAdmin && (
        <form onSubmit={handleAdd} className="mb-5 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-3">Invite a new member</p>
          <div className="flex gap-2">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="member@example.com" className="input-field flex-1"/>
            <select value={permission} onChange={e => setPermission(e.target.value)}
              className="input-field !w-32">
              {PERM_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <button type="submit" disabled={adding} className="btn-primary flex items-center gap-1.5 whitespace-nowrap">
              {adding ? <Loader2 size={14} className="animate-spin"/> : <UserPlus size={14}/>} Invite
            </button>
          </div>
          <div className="flex gap-4 mt-2">
            {PERM_OPTIONS.map(p => (
              <span key={p.value} className="text-[10px] text-slate-400">
                <strong>{p.label}:</strong> {p.desc}
              </span>
            ))}
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400"/></div>
      ) : (
        <div className="space-y-1">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.id === project.adminId ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">Owner</span>
                ) : isAdmin ? (
                  <select value={member.permission} onChange={e => handlePermChange(member.id, e.target.value)}
                    className="text-[10px] font-semibold px-2 py-1 rounded border border-surface-border bg-white cursor-pointer">
                    {PERM_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${PERM_BADGES[member.permission] || PERM_BADGES.VIEW}`}>
                    {member.permission}
                  </span>
                )}
                {isAdmin && member.id !== project.adminId && (
                  <button onClick={() => handleRemove(member.id)}
                    className="p-1 rounded hover:bg-danger-light text-slate-400 hover:text-danger transition-colors">
                    <X size={14}/>
                  </button>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No members yet</p>}
        </div>
      )}
    </div>
  );
};

export default MemberManager;
