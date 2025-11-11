import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getRecipes, deleteRecipe } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Recipe } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard: React.FC = () => {
    const { user, updateProfile, unsaveRecipe, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
    const [updateLoading, setUpdateLoading] = useState(false);

    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [recipesLoading, setRecipesLoading] = useState(true);

    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [savedLoading, setSavedLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setProfilePhoto(user.profilePhoto || '');
        }
    }, [user]);

    const fetchMyRecipes = useCallback(async () => {
        if (!user) return;
        setRecipesLoading(true);
        try {
            const allRecipes = await getRecipes();
            setMyRecipes(allRecipes.filter(recipe => recipe.author.id === user.id));
        } catch (error) {
            toast.error("Could not fetch your recipes.");
        } finally {
            setRecipesLoading(false);
        }
    }, [user]);

    const fetchSavedRecipes = useCallback(async () => {
        if (!user || !user.savedRecipeIds || user.savedRecipeIds.length === 0) {
            setSavedRecipes([]);
            setSavedLoading(false);
            return;
        }
        setSavedLoading(true);
        try {
            const allRecipes = await getRecipes();
            const userSavedRecipes = allRecipes.filter(recipe => user.savedRecipeIds!.includes(recipe.id));
            setSavedRecipes(userSavedRecipes);
        } catch (error) {
            toast.error("Could not fetch your saved recipes.");
        } finally {
            setSavedLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyRecipes();
        fetchSavedRecipes();
    }, [fetchMyRecipes, fetchSavedRecipes]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await deleteRecipe(id);
                toast.success("Recipe deleted!");
                fetchMyRecipes();
            } catch (error) {
                toast.error("Failed to delete recipe.");
            }
        }
    };
    
    const handleUnsave = async (recipeId: string) => {
        try {
            await unsaveRecipe(recipeId);
            toast.success("Recipe unsaved!");
        } catch (error) {
            toast.error("Failed to unsave recipe.");
        }
    };
    
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            await updateProfile({ name, profilePhoto });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (authLoading || !user) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
        >
            <div className="bg-white dark:bg-light-charcoal p-8 rounded-lg shadow-xl mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <img
                        src={user.profilePhoto || `https://i.pravatar.cc/150?u=${user.email}`}
                        alt={user.name}
                        className="h-32 w-32 rounded-full object-cover border-4 border-coral"
                    />
                    <div className="flex-grow text-center sm:text-left">
                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="max-w-md">
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Profile Photo URL</label>
                                    <input
                                        type="url"
                                        id="profilePhoto"
                                        value={profilePhoto}
                                        onChange={(e) => setProfilePhoto(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition disabled:bg-opacity-50"
                                    >
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-200 dark:bg-charcoal text-charcoal dark:text-cream font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-opacity-80 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold font-display text-charcoal dark:text-cream">{user.name}</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition"
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Recipes */}
                <div className="flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-display">My Recipes</h2>
                        <Link to="/create-recipe" className="bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition text-sm">
                            + Add New
                        </Link>
                    </div>
                    {recipesLoading ? (
                        <LoadingSpinner />
                    ) : myRecipes.length > 0 ? (
                        <div className="bg-white dark:bg-light-charcoal rounded-lg shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {myRecipes.map(recipe => (
                                    <li key={recipe.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-mint dark:hover:bg-charcoal transition-colors space-y-3 sm:space-y-0">
                                        <div className="flex items-center min-w-0">
                                            <img src={recipe.imageURL} alt={recipe.title} className="h-16 w-16 object-cover rounded-md mr-4 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <Link to={`/recipes/${recipe.id}`} className="font-bold text-lg hover:text-coral truncate block">{recipe.title}</Link>
                                                <p className="text-sm text-gray-500">{recipe.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-auto sm:ml-2 flex-shrink-0">
                                            <button onClick={() => navigate(`/edit-recipe/${recipe.id}`)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                                            <button onClick={() => handleDelete(recipe.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full flex flex-col justify-center items-center">
                            <p className="text-xl">You haven't created any recipes yet.</p>
                            <Link to="/create-recipe" className="mt-4 inline-block text-coral font-bold hover:underline">
                                Create your first recipe!
                            </Link>
                        </div>
                    )}
                </div>
                {/* Saved Recipes */}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold font-display mb-4">Saved Recipes</h2>
                    {savedLoading ? (
                        <LoadingSpinner />
                    ) : savedRecipes.length > 0 ? (
                        <div className="bg-white dark:bg-light-charcoal rounded-lg shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {savedRecipes.map(recipe => (
                                    <li key={recipe.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-mint dark:hover:bg-charcoal transition-colors space-y-3 sm:space-y-0">
                                        <div className="flex items-center min-w-0">
                                            <img src={recipe.imageURL} alt={recipe.title} className="h-16 w-16 object-cover rounded-md mr-4 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <Link to={`/recipes/${recipe.id}`} className="font-bold text-lg hover:text-coral truncate block">{recipe.title}</Link>
                                                <p className="text-sm text-gray-500">by {recipe.author.name}</p>
                                            </div>
                                        </div>
                                        <div className="ml-auto sm:ml-2 flex-shrink-0">
                                            <button onClick={() => handleUnsave(recipe.id)} className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600">Unsave</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full flex flex-col justify-center items-center">
                            <p className="text-xl">You haven't saved any recipes yet.</p>
                            <Link to="/recipes" className="mt-4 inline-block text-coral font-bold hover:underline">
                                Explore recipes to save!
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserDashboard;