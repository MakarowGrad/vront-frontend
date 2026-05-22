/**
 * UI Store - Zustand
 * Manages UI state including active animated card
 */

import { create } from 'zustand';
import { AnimationState } from '@/app/types';

interface UIState {
  // Active animated card (only one card animates at a time)
  activeAnimatedCardId: string | null;
  activeCardAnimationState: AnimationState;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Filters
  isFilterPanelOpen: boolean;
  
  // Actions
  setActiveCard: (cardId: string) => void;
  clearActiveCard: () => void;
  setActiveCardAnimationState: (state: AnimationState) => void;
  
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (isOpen: boolean) => void;
  
  // Reset all UI state
  resetUI: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  // Active animated card
  activeAnimatedCardId: null,
  activeCardAnimationState: 'idle',
  
  // Mobile menu
  isMobileMenuOpen: false,
  
  // Search
  isSearchOpen: false,
  searchQuery: '',
  
  // Filters
  isFilterPanelOpen: false,

  setActiveCard: (cardId: string) => {
    set({ 
      activeAnimatedCardId: cardId,
      activeCardAnimationState: 'idle'
    });
  },

  clearActiveCard: () => {
    set({ 
      activeAnimatedCardId: null,
      activeCardAnimationState: 'idle'
    });
  },

  setActiveCardAnimationState: (state: AnimationState) => {
    set({ activeCardAnimationState: state });
  },

  toggleMobileMenu: () => {
    const { isMobileMenuOpen } = get();
    set({ isMobileMenuOpen: !isMobileMenuOpen });
  },

  setMobileMenuOpen: (isOpen: boolean) => {
    set({ isMobileMenuOpen: isOpen });
  },

  toggleSearch: () => {
    const { isSearchOpen } = get();
    set({ isSearchOpen: !isSearchOpen });
  },

  setSearchOpen: (isOpen: boolean) => {
    set({ isSearchOpen: isOpen });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  toggleFilterPanel: () => {
    const { isFilterPanelOpen } = get();
    set({ isFilterPanelOpen: !isFilterPanelOpen });
  },

  setFilterPanelOpen: (isOpen: boolean) => {
    set({ isFilterPanelOpen: isOpen });
  },

  resetUI: () => {
    set({
      activeAnimatedCardId: null,
      activeCardAnimationState: 'idle',
      isMobileMenuOpen: false,
      isSearchOpen: false,
      searchQuery: '',
      isFilterPanelOpen: false,
    });
  },
}));
