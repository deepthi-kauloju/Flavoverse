
export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  savedRecipeIds?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: string;
  prepTime: number; // in minutes
  imageURL: string;
  author: User;
  createdAt: string;
}