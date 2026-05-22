/**
 * useFavorites Hook
 * Convenient hook for favorites operations with toast notifications
 */

import { useCallback } from 'react';
import { useFavoritesStore } from '@/app/store/favoritesStore';
import { toast } from '@/app/components/ui/toast';

export function useFavorites() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    getFavoritesCount,
  } = useFavoritesStore();

  const addToFavoritesWithToast = useCallback(
    (dishId: string, dishTitle: string) => {
      addFavorite(dishId);
      toast.success({ title: 'Добавлено в избранное', description: `${dishTitle} добавлено в избранное` });
    },
    [addFavorite]
  );

  const removeFromFavoritesWithToast = useCallback(
    (dishId: string, dishTitle: string) => {
      removeFavorite(dishId);
      toast.info({ title: 'Удалено из избранного', description: `${dishTitle} удалено из избранного` });
    },
    [removeFavorite]
  );

  const toggleFavoriteWithToast = useCallback(
    (dishId: string, dishTitle: string) => {
      const isCurrentlyFavorite = isFavorite(dishId);
      toggleFavorite(dishId);
      
      if (isCurrentlyFavorite) {
        toast.info({ title: 'Удалено из избранного', description: `${dishTitle} удалено из избранного` });
      } else {
        toast.success({ title: 'Добавлено в избранное', description: `${dishTitle} добавлено в избранное` });
      }
    },
    [toggleFavorite, isFavorite]
  );

  const clearAllFavoritesWithConfirmation = useCallback(() => {
    if (favorites.length === 0) return;
    
    clearFavorites();
    toast.info({ title: 'Избранное очищено', description: 'Все блюда удалены из избранного' });
  }, [favorites.length, clearFavorites, toast]);

  return {
    // State
    favorites,
    favoritesCount: getFavoritesCount(),
    
    // Actions
    addFavorite: addToFavoritesWithToast,
    removeFavorite: removeFromFavoritesWithToast,
    toggleFavorite: toggleFavoriteWithToast,
    clearFavorites: clearAllFavoritesWithConfirmation,
    
    // Getters
    isFavorite,
  };
}
