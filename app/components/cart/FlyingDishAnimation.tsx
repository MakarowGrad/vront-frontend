'use client';

/**
 * Flying Dish Animation
 * Card flies from dish position to cart in header with rotation
 */

import React, { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Dish } from '@/app/types';
import { getImageUrl } from '@/app/lib/utils';

interface FlyingItem {
  id: string;
  dish: Dish;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyingDishContextType {
  triggerFlyAnimation: (dish: Dish, cardElement: HTMLElement, cartElement: HTMLElement) => void;
}

const FlyingDishContext = createContext<FlyingDishContextType | null>(null);

export function useFlyingDish() {
  const context = useContext(FlyingDishContext);
  if (!context) {
    throw new Error('useFlyingDish must be used within FlyingDishProvider');
  }
  return context;
}

interface FlyingDishAnimationProps {
  children: React.ReactNode;
}

export function FlyingDishProvider({ children }: FlyingDishAnimationProps) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const triggerFlyAnimation = useCallback((
    dish: Dish, 
    cardElement: HTMLElement,
    cartElement: HTMLElement
  ) => {
    const cardRect = cardElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();

    const newItem: FlyingItem = {
      id: `${dish.id}-${Date.now()}`,
      dish,
      startX: cardRect.left + cardRect.width / 2,
      startY: cardRect.top + cardRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    };

    setFlyingItems(prev => [...prev, newItem]);

    // Remove after animation
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== newItem.id));
    }, 800);
  }, []);

  return (
    <FlyingDishContext.Provider value={{ triggerFlyAnimation }} suppressHydrationWarning>
      {children}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <FlyingCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </FlyingDishContext.Provider>
  );
}

interface FlyingCardProps {
  item: FlyingItem;
}

function FlyingCard({ item }: FlyingCardProps) {
  return (
    <motion.div
      initial={{
        x: item.startX - 60,
        y: item.startY - 45,
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        x: item.endX - 20,
        y: item.endY - 20,
        scale: 0.3,
        rotate: 360,
        opacity: [1, 1, 0.8, 0],
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.2, 0.8, 0.2, 1],
        rotate: {
          duration: 0.7,
          ease: "linear",
        },
      }}
      className="fixed z-[100] pointer-events-none"
      style={{
        width: 120,
        height: 90,
      }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-gold bg-surface-secondary">
        <Image
          src={getImageUrl(item.dish.coverImage)}
          alt={item.dish.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-1 left-1 right-1">
          <p className="text-[8px] text-white font-medium truncate">
            {item.dish.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
