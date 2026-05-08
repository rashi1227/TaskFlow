import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2, Shield, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete('/users/me');
      toast.success('Your account has been permanently deleted');
      dispatch(logout());
      dispatch(reset());
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6" id="settings-page">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      {/* Profile Info */}
      <div className="card">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-2">
          <User size={16} /> Profile Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <div className="input-field bg-slate-50 text-slate-500 cursor-not-allowed">
                {user?.name}
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="input-field bg-slate-50 text-slate-500 cursor-not-allowed">
                {user?.email}
              </div>
            </div>
          </div>
          <div>
            <label className="label">Account Role</label>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary">
              <Shield size={12} />
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-danger/20 bg-danger/5">
        <h3 className="text-sm font-bold text-danger uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle size={16} /> Danger Zone
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Deleting your account is permanent and cannot be undone. All your project ownerships will be removed, and your tasks will be unassigned.
        </p>

        <div className="space-y-4">
          <div>
            <label className="label text-danger">Type <span className="font-bold">DELETE</span> to confirm</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE here..."
                className="input-field border-danger/30 focus:border-danger focus:ring-danger/20 max-w-xs"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== 'DELETE'}
                className="btn-danger flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
