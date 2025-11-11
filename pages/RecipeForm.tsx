
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { createRecipe, getRecipeById, updateRecipe } from '../services/api';
import { generateRecipeSuggestion } from '../services/geminiService';
import { RECIPE_CATEGORIES } from '../constants';
import type { Recipe } from '../types';

const RecipeForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [category, setCategory] = useState(RECIPE_CATEGORIES[0]);
  const [prepTime, setPrepTime] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const fetchRecipe = async () => {
        try {
          const recipe = await getRecipeById(id);
          if (recipe.author.id !== user?.id) {
             toast.error("You can't edit someone else's recipe!");
             navigate('/recipes');
             return;
          }
          setTitle(recipe.title);
          setDescription(recipe.description);
          setIngredients(recipe.ingredients);
          setSteps(recipe.steps);
          setCategory(recipe.category);
          setPrepTime(String(recipe.prepTime));
          setImageURL(recipe.imageURL);
        } catch (error) {
          toast.error('Failed to load recipe.');
          navigate('/recipes');
        }
      };
      fetchRecipe();
    }
  }, [id, isEditing, navigate, user]);

  const handleListChange = (index: number, value: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const addListItem = (setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => [...prev, '']);
  };

  const removeListItem = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.length > 1) {
      setList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleGenerateDescription = async () => {
    if (!title || ingredients.length === 0 || ingredients[0] === '') {
        toast.error('Please provide a title and at least one ingredient.');
        return;
    }
    setAiLoading(true);
    const prompt = `Generate a short, appetizing recipe description for a dish called "${title}" with ingredients: ${ingredients.join(', ')}. Keep it under 50 words.`;
    try {
        const generatedDesc = await generateRecipeSuggestion(prompt);
        setDescription(generatedDesc);
        toast.success('Description generated!');
    } catch (error) {
        toast.error('Could not generate description.');
    } finally {
        setAiLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    setLoading(true);

    const recipeData = {
      title,
      description,
      ingredients: ingredients.filter(i => i.trim() !== ''),
      steps: steps.filter(s => s.trim() !== ''),
      category,
      prepTime: Number(prepTime),
      imageURL: imageURL || `https://picsum.photos/seed/${title.split(' ').join('+')}/600/400`,
      author: user
    };

    try {
      let savedRecipe: Recipe;
      if (isEditing && id) {
        savedRecipe = await updateRecipe(id, recipeData);
        toast.success('Recipe updated successfully!');
      } else {
        savedRecipe = await createRecipe(recipeData);
        toast.success('Recipe created successfully!');
      }
      navigate(`/recipes/${savedRecipe.id}`);
    } catch (error) {
      toast.error('Failed to save recipe.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderListInputs = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, label: string) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
        {list.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
                <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange(index, e.target.value, list, setList)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal"
                    required
                />
                <button type="button" onClick={() => removeListItem(index, list, setList)} className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={list.length <= 1} aria-label={`Remove ${label.slice(0, -1)}`}>
                    &times;
                </button>
            </div>
        ))}
        <button type="button" onClick={() => addListItem(setList)} className="text-sm text-coral hover:underline">
            + Add {label.slice(0, -1)}
        </button>
    </div>
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-10"
    >
      <div className="bg-white dark:bg-light-charcoal p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center font-display text-charcoal dark:text-cream mb-6">
          {isEditing ? 'Edit Recipe' : 'Create a New Recipe'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal"></textarea>
            <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="mt-2 text-sm text-coral hover:underline disabled:opacity-50">
              {aiLoading ? 'Generating...' : '✨ Generate with AI'}
            </button>
          </div>
          
          {renderListInputs(ingredients, setIngredients, 'Ingredients')}
          {renderListInputs(steps, setSteps, 'Steps')}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal">
                {RECIPE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Prep Time (minutes)</label>
              <input type="number" id="prepTime" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required min="0" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal" />
            </div>
          </div>

          <div>
            <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Image URL (Optional)</label>
            <input type="url" id="imageURL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-cream dark:bg-charcoal" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-coral text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-200 disabled:bg-opacity-50">
            {loading ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default RecipeForm;
