
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getRecipeById } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Recipe } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from './NotFoundPage';

const RecipeDetailPage: React.FC = () => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated, saveRecipe, unsaveRecipe } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const isSaved = user?.savedRecipeIds?.includes(recipe?.id || '') || false;

    const handleSaveToggle = async () => {
        if (!isAuthenticated || !recipe) {
            toast.error("You must be logged in to save recipes.");
            return;
        }
        setIsSaving(true);
        try {
            if (isSaved) {
                await unsaveRecipe(recipe.id);
                toast.success("Recipe removed from your saved list!");
            } else {
                await saveRecipe(recipe.id);
                toast.success("Recipe saved!");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><LoadingSpinner /></div>;
    if (error || !recipe) return <NotFoundPage message="Recipe not found!" />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-light-charcoal rounded-lg shadow-xl overflow-hidden"
        >
            <img src={recipe.imageURL} alt={recipe.title} className="w-full h-64 md:h-96 object-cover" />
            <div className="p-6 md:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div className="flex-1">
                        <span className="inline-block bg-mint dark:bg-charcoal text-coral dark:text-cream text-sm font-semibold px-3 py-1 rounded-full mb-2">
                            {recipe.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-charcoal dark:text-cream">{recipe.title}</h1>
                    </div>
                    <Link to="#" className="flex-shrink-0 flex items-center text-gray-600 dark:text-gray-300 mt-4 sm:mt-2 sm:ml-4">
                        <img src={recipe.author.profilePhoto || `https://i.pravatar.cc/150?u=${recipe.author.email}`} alt={recipe.author.name} className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-coral" />
                        <span>{recipe.author.name}</span>
                    </Link>
                </div>

                {isAuthenticated && recipe.author.id !== user?.id && (
                     <div className="mb-6">
                        <button
                            onClick={handleSaveToggle}
                            disabled={isSaving}
                            className="flex items-center space-x-2 bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-200 disabled:bg-opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span>{isSaving ? (isSaved ? 'Removing...' : 'Saving...') : (isSaved ? 'Saved' : 'Save Recipe')}</span>
                        </button>
                    </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">{recipe.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold font-display mb-4">Ingredients</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold font-display mb-4">Steps</h2>
                        <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
                            {recipe.steps.map((item, index) => <li key={index} className="pl-2">{item}</li>)}
                        </ol>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeDetailPage;