
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123'); // Dummy password
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Failed to log in. Please check your credentials.');
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
        <h2 className="text-3xl font-bold text-center font-display text-charcoal dark:text-cream mb-6">Login</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Use a mock email like `alice@example.com` or `bob@example.com`. Password can be anything.
        </p>
        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-coral hover:text-opacity-80">
                Register here
            </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
