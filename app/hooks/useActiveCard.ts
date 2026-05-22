/**
 * useActiveCard Hook
 * Manages the active animated card state
 * Ensures only one card animates at a time
 */

import { useCallback, useEffect, useRef } from 'react';
import { useUIStore } from '@/app/store/uiStore';
import { AnimationState } from '@/app/types';

interface UseActiveCardOptions {
  cardId: string;
  hasVideo?: boolean;
  onAnimationComplete?: () => void;
}

export function useActiveCard({
  cardId,
  hasVideo = false,
  onAnimationComplete,
}: UseActiveCardOptions) {
  const {
    activeAnimatedCardId,
    activeCardAnimationState,
    setActiveCard,
    clearActiveCard,
    setActiveCardAnimationState,
  } = useUIStore();

  const isActive = activeAnimatedCardId === cardId;
  const canActivate = !activeAnimatedCardId || activeAnimatedCardId === cardId;
  
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const activateCard = useCallback(() => {
    if (canActivate) {
      setActiveCard(cardId);
      return true;
    }
    return false;
  }, [canActivate, cardId, setActiveCard]);

  const deactivateCard = useCallback(() => {
    if (isActive) {
      clearActiveCard();
    }
  }, [isActive, clearActiveCard]);

  const startExplodeAnimation = useCallback(() => {
    if (!hasVideo) {
      // Fallback: just show composition modal or navigate
      return false;
    }

    if (!activateCard()) {
      return false;
    }

    setActiveCardAnimationState('exploding');
    
    // Simulate video duration
    animationTimeoutRef.current = setTimeout(() => {
      setActiveCardAnimationState('exploded');
    }, 2000);

    return true;
  }, [hasVideo, activateCard, setActiveCardAnimationState]);

  const startAssembleAnimation = useCallback(() => {
    if (!isActive) return false;

    setActiveCardAnimationState('assembling');
    
    // Simulate video duration
    animationTimeoutRef.current = setTimeout(() => {
      setActiveCardAnimationState('assembled');
      onAnimationComplete?.();
      
      // Reset after a short delay
      animationTimeoutRef.current = setTimeout(() => {
        deactivateCard();
      }, 500);
    }, 2000);

    return true;
  }, [isActive, setActiveCardAnimationState, deactivateCard, onAnimationComplete]);

  const resetAnimation = useCallback(() => {
    if (isActive) {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      deactivateCard();
    }
  }, [isActive, deactivateCard]);

  const getAnimationProgress = useCallback(() => {
    switch (activeCardAnimationState) {
      case 'idle':
        return 0;
      case 'exploding':
        return 25;
      case 'exploded':
        return 50;
      case 'assembling':
        return 75;
      case 'assembled':
        return 100;
      default:
        return 0;
    }
  }, [activeCardAnimationState]);

  return {
    // State
    isActive,
    canActivate,
    animationState: isActive ? activeCardAnimationState : 'idle',
    
    // Actions
    activateCard,
    deactivateCard,
    startExplodeAnimation,
    startAssembleAnimation,
    resetAnimation,
    
    // Getters
    getAnimationProgress,
    
    // Helpers
    isAnimating: isActive && activeCardAnimationState !== 'idle',
    isExploded: isActive && activeCardAnimationState === 'exploded',
  };
}
