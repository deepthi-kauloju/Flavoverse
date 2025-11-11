
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRecipes } from '../services/api';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
    const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const allRecipes = await getRecipes();
                setTrendingRecipes(allRecipes.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch trending recipes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <section className="text-center py-16 px-4 bg-mint dark:bg-light-charcoal rounded-lg shadow-md mb-12">
                <motion.h1 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-extrabold font-display text-charcoal dark:text-cream mb-4"
                >
                    Welcome to FlavorVerse
                </motion.h1>
                <motion.p 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8"
                >
                    Your ultimate destination to discover, create, and share delicious recipes from around the world.
                </motion.p>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Link
                        to="/recipes"
                        className="inline-block bg-coral text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-80 transition-transform transform hover:scale-105"
                    >
                        Explore Recipes
                    </Link>
                </motion.div>
            </section>

            <section>
                <h2 className="text-3xl font-bold font-display text-center mb-8">Trending Recipes</h2>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
            </section>
        </motion.div>
    );
};

export default HomePage;
