
import type { Recipe, User } from '../types';
import { MOCK_RECIPES, MOCK_USERS } from '../constants';

// In-memory store for mock data
let recipes: Recipe[] = [...MOCK_RECIPES];
let users: User[] = [...MOCK_USERS];

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(data)));
    }, 500);
  });
};

// --- Auth ---
export const apiRegister = async (userData: Omit<User, 'id'>) => {
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  const newUser: User = { id: `user-${Date.now()}`, savedRecipeIds: [], ...userData };
  users.push(newUser);
  return simulateDelay({ user: newUser, token: `mock-token-${newUser.id}` });
};

export const apiLogin = async (credentials: Pick<User, 'email'>) => {
  const user = users.find(u => u.email === credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  return simulateDelay({ user, token: `mock-token-${user.id}` });
};

// --- User Actions ---

export const saveRecipeForUser = async (userId: string, recipeId: string) => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  if (!users[userIndex].savedRecipeIds) {
    users[userIndex].savedRecipeIds = [];
  }
  if (!users[userIndex].savedRecipeIds!.includes(recipeId)) {
    users[userIndex].savedRecipeIds!.push(recipeId);
  }
  return simulateDelay(users[userIndex]);
};

export const unsaveRecipeForUser = async (userId: string, recipeId: string) => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  if (users[userIndex].savedRecipeIds) {
    users[userIndex].savedRecipeIds = users[userIndex].savedRecipeIds!.filter(id => id !== recipeId);
  }
  return simulateDelay(users[userIndex]);
};

export const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'email'>>) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index] = { ...users[index], ...userData };
  return simulateDelay(users[index]);
};

// --- Recipes ---
export const getRecipes = async ({ query = '', category = '', prepTime = '' } = {}) => {
  let filteredRecipes = recipes;

  if (category) {
    filteredRecipes = filteredRecipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (prepTime) {
    if (prepTime.includes('+')) {
      const minTime = parseInt(prepTime.replace('+', ''), 10);
      filteredRecipes = filteredRecipes.filter(r => r.prepTime >= minTime);
    } else if (prepTime.includes('-')) {
      const [min, max] = prepTime.split('-').map(Number);
      filteredRecipes = filteredRecipes.filter(r => r.prepTime >= min && r.prepTime <= max);
    }
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredRecipes = filteredRecipes.filter(r => 
      r.title.toLowerCase().includes(lowerQuery) || 
      r.ingredients.some(i => i.toLowerCase().includes(lowerQuery))
    );
  }

  return simulateDelay(filteredRecipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

export const getRecipeById = async (id: string) => {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  return simulateDelay(recipe);
};

export const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
  const newRecipe: Recipe = {
    ...recipeData,
    id: `recipe-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  recipes.unshift(newRecipe);
  return simulateDelay(newRecipe);
};

export const updateRecipe = async (id: string, recipeData: Partial<Omit<Recipe, 'id' | 'createdAt'>>) => {
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Recipe not found');
  }
  recipes[index] = { ...recipes[index], ...recipeData };
  return simulateDelay(recipes[index]);
};

export const deleteRecipe = async (id: string) => {
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Recipe not found');
  }
  recipes.splice(index, 1);
  return simulateDelay({ success: true });
};