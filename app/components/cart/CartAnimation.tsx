'use client';

/**
 * Cart Animation Component
 * Fun animation when adding items to cart
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Plus } from 'lucide-react';

interface CartAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

export function CartAnimation({ isActive, onComplete }: CartAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate random particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);

      // Complete after animation
      const timer = setTimeout(() => {
        onComplete();
        setParticles([]);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Central burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute"
          >
            <div className="w-32 h-32 rounded-full bg-gold/30 blur-xl" />
          </motion.div>

          {/* Shopping bag icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ 
              scale: [0, 1.3, 1],
              rotate: [0, 10, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center shadow-2xl shadow-gold/50">
              <ShoppingBag className="w-10 h-10 text-background-primary" />
            </div>
            
            {/* Plus badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Sparkles */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 1] }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="absolute"
          >
            <Sparkles className="w-8 h-8 text-gold" />
          </motion.div>

          {/* Flying particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0,
                opacity: 1 
              }}
              animate={{ 
                scale: [0, 1, 0.5],
                x: particle.x,
                y: [0, -100 - Math.random() * 100],
                opacity: [1, 1, 0]
              }}
              transition={{ 
                delay: particle.delay,
                duration: 0.8,
                ease: "easeOut"
              }}
              className="absolute"
            >
              <div 
                className="w-3 h-3 rounded-full bg-gold"
                style={{
                  boxShadow: '0 0 10px rgba(201, 169, 98, 0.8)'
                }}
              />
            </motion.div>
          ))}

          {/* Success text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute mt-28"
          >
            <span className="text-lg font-semibold text-gold">В корзину!</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Floating Cart Button Animation
 * Button that floats and pulses when items are added
 */
export function FloatingCartButton({ 
  itemCount, 
  onClick 
}: { 
  itemCount: number; 
  onClick: () => void;
}) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-2 px-4 py-2 bg-gold text-background-primary rounded-xl font-medium shadow-lg"
    >
      <ShoppingBag className="w-5 h-5" />
      <span>Корзина</span>
      
      {/* Animated badge */}
      <AnimatePresence mode="wait">
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className={cn(
              "ml-1 px-2 py-0.5 bg-background-primary text-gold rounded-full text-sm font-bold",
              isPulsing && "animate-bounce"
            )}
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse ring */}
      {isPulsing && (
        <motion.span
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-xl border-2 border-gold"
        />
      )}
    </motion.button>
  );
}

// Helper import for cn
import { cn } from '@/app/lib/utils';
