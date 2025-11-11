import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecipes } from '../services/api';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES, PREP_TIME_OPTIONS } from '../constants';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const RecipeListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const prepTime = searchParams.get('prepTime') || '';
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getRecipes({ query, category, prepTime });
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [query, category, prepTime]);

  const handleFilterChange = (param: string, value: string) => {
    setSearchParams(params => {
        if (!value) {
            params.delete(param);
        } else {
            params.set(param, value);
        }
        return params;
    });
  };

  const clearFilters = () => {
    setSearchParams(params => {
        params.delete('category');
        params.delete('prepTime');
        return params;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('query', localQuery);
  };
  
  const pageTitle = useMemo(() => {
    if (query) return `Search results for "${query}"`;
    let title = 'All Recipes';
    if (category) title = `${category} Recipes`;
    if (prepTime) {
        const option = PREP_TIME_OPTIONS.find(o => o.value === prepTime);
        if (option) {
            const timeDesc = `(${option.label})`;
            if (title === 'All Recipes') title = `Recipes ${timeDesc}`;
            else title += ` ${timeDesc}`;
        }
    }
    return title;
  }, [query, category, prepTime]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className={`w-full md:w-1/4 lg:w-1/5 md:block ${showFilters ? 'block' : 'hidden'}`}>
        <div className="p-4 bg-white dark:bg-light-charcoal rounded-lg shadow-md md:sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold font-display">Filters</h3>
             <button
              onClick={() => setShowFilters(false)}
              className="md:hidden text-charcoal dark:text-cream"
              aria-label="Close filters"
            >
              &times;
            </button>
            <button 
              onClick={clearFilters}
              className="text-sm text-coral hover:underline"
            >
              Clear All
            </button>
          </div>
          
          <div>
            <h4 className="font-semibold font-display mb-2">Category</h4>
            <ul>
              <li className="mb-2">
                <button 
                  onClick={() => handleFilterChange('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${!category ? 'bg-coral text-white' : 'hover:bg-mint dark:hover:bg-charcoal'}`}
                >
                  All
                </button>
              </li>
              {RECIPE_CATEGORIES.map(cat => (
                <li key={cat} className="mb-2">
                  <button 
                    onClick={() => handleFilterChange('category', cat)}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${category === cat ? 'bg-coral text-white' : 'hover:bg-mint dark:hover:bg-charcoal'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold font-display mb-2">Preparation Time</h4>
            <ul>
              <li className="mb-2">
                  <button 
                    onClick={() => handleFilterChange('prepTime', '')}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${!prepTime ? 'bg-coral text-white' : 'hover:bg-mint dark:hover:bg-charcoal'}`}
                  >
                    Any
                  </button>
              </li>
              {PREP_TIME_OPTIONS.map(opt => (
                <li key={opt.value} className="mb-2">
                  <button 
                    onClick={() => handleFilterChange('prepTime', opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${prepTime === opt.value ? 'bg-coral text-white' : 'hover:bg-mint dark:hover:bg-charcoal'}`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow">
            <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search by name or ingredient..."
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-light-charcoal border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-coral text-lg"
                aria-label="Search recipes"
            />
            <button type="submit" aria-label="Submit search" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-coral text-white rounded-md hover:bg-opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <button
              onClick={() => setShowFilters(true)}
              className="md:hidden flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-coral text-white font-bold"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span>Show Filters</span>
          </button>
        </div>
        
        <h1 className="text-3xl font-bold font-display mb-6">
          {pageTitle}
        </h1>
        {loading ? (
          <LoadingSpinner />
        ) : recipes.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl">No recipes found. Try a different search or filter!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecipeListPage;