
import React from 'react';
import { Link } from 'react-router-dom';

interface NotFoundPageProps {
  message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ message = "Oops! Page not found." }) => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-extrabold text-coral font-display">404</h1>
      <p className="text-2xl mt-4 mb-8">{message}</p>
      <Link to="/" className="bg-coral text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-80 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
