
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-light-charcoal rounded-lg shadow-lg overflow-hidden transition-colors duration-300"
    >
      <Link to={`/recipes/${recipe.id}`}>
        <img src={recipe.imageURL} alt={recipe.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <span className="inline-block bg-mint dark:bg-charcoal text-coral dark:text-cream text-xs font-semibold px-2 py-1 rounded-full mb-2">
            {recipe.category}
          </span>
          <h3 className="font-display text-lg font-bold text-charcoal dark:text-cream mb-2 truncate">{recipe.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{recipe.description}</p>
          <div className="flex items-center mt-4">
            <img src={recipe.author.profilePhoto || `https://i.pravatar.cc/150?u=${recipe.author.email}`} alt={recipe.author.name} className="h-8 w-8 rounded-full object-cover mr-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.author.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
