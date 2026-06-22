"use client";

/**
 * Home Page - Root
 * Hero text + Menu section with categories and featured dishes
 */

import React from "react";
import { HeroSection } from "@/app/components/home/HeroSection";
import { MenuSection } from "@/app/components/home/MenuSection";

export default function HomePage() {
  return (
    <div className="relative bg-background-primary">
      {/* Hero Section */}
      <HeroSection />

      {/* Menu: categories + featured dishes */}
      <MenuSection />
    </div>
  );
}
