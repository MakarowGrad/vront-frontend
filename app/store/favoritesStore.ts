/**
 * Favorites Store - Zustand
 * Manages favorite dishes with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // Array of dish IDs
  
  // Actions
  addFavorite: (dishId: string) => void;
  removeFavorite: (dishId: string) => void;
  toggleFavorite: (dishId: string) => void;
  clearFavorites: () => void;
  setFavorites: (favorites: string[]) => void;
  
  // Getters
  isFavorite: (dishId: string) => boolean;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (dishId: string) => {
        const { favorites } = get();
        if (!favorites.includes(dishId)) {
          set({ favorites: [...favorites, dishId] });
        }
      },

      removeFavorite: (dishId: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((id) => id !== dishId) });
      },

      toggleFavorite: (dishId: string) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(dishId)) {
          removeFavorite(dishId);
        } else {
          addFavorite(dishId);
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      setFavorites: (favorites: string[]) => {
        set({ favorites });
      },

      isFavorite: (dishId: string) => {
        const { favorites } = get();
        return favorites.includes(dishId);
      },

      getFavoritesCount: () => {
        const { favorites } = get();
        return favorites.length;
      },
    }),
    {
      name: 'gourmet-express-favorites',
      version: 1,
    }
  )
);
