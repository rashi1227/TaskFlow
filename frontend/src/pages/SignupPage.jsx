import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });

  const { name, email, password, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="card !p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
                TM
              </div>
              <span className="text-lg font-bold text-primary">Task Manager</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-1">Create your account</h2>
            <p className="text-sm text-slate-500">Get started with your team in seconds.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" id="signup-form">
            <div>
              <label htmlFor="signup-name" className="label">Full Name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="input-field"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="label">Email</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="label">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                className="input-field"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label htmlFor="signup-role" className="label">Role</label>
              <select
                id="signup-role"
                name="role"
                value={role}
                onChange={onChange}
                className="input-field"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
