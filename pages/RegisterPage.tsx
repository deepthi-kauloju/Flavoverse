
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to register. This email might already exist.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10"
    >
      <div className="bg-white dark:bg-light-charcoal p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center font-display text-charcoal dark:text-cream mb-6">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-coral focus:border-coral bg-cream dark:bg-charcoal"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-coral focus:border-coral bg-cream dark:bg-charcoal"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-coral focus:border-coral bg-cream dark:bg-charcoal"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-200 disabled:bg-opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
         <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-coral hover:text-opacity-80">
                Login here
            </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
