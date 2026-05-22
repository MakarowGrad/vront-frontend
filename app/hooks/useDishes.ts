/**
 * useDishes Hook - TanStack Query
 * Server state management for dishes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dish, DishFilters, CreateDishInput, UpdateDishInput } from '@/app/types';
import { apiFetch, API_BASE } from '@/lib/api';
import { db, syncMenuToDB } from '@/app/lib/db';

const DISHES_KEY = 'dishes';

// API functions
async function fetchDishes(filters?: DishFilters): Promise<Dish[]> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${API_BASE}/catalog/dishes?${params.toString()}`, {
      credentials: 'include',
      mode: 'cors',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      console.error('[fetchDishes] HTTP', response.status, errText);
      throw new Error(`Failed to fetch dishes: ${response.status}`);
    }

    const data = await response.json();
    const dishes = Array.isArray(data) ? data : (data.data || []);
    await syncMenuToDB([], dishes).catch(() => {}); // cache dishes in background
    return dishes;
  } catch (err) {
    console.error('[fetchDishes] Error:', err);
    // Fallback to IndexedDB
    const cached = await db.dishes.toArray();
    if (cached.length > 0) return cached;
    throw new Error('Failed to fetch dishes and no cache available');
  }
}

async function fetchDishById(id: string): Promise<Dish> {
  const response = await fetch(`${API_BASE}/catalog/dishes/id/${id}`, {
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dish');
  }

  const data = await response.json();
  return data.data || data;
}

async function fetchDishBySlug(slug: string): Promise<Dish> {
  const response = await fetch(`${API_BASE}/catalog/dishes/slug/${slug}`, {
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dish');
  }

  const data = await response.json();
  return data.data || data;
}

async function createDish(input: CreateDishInput): Promise<Dish> {
  const response = await apiFetch('/catalog/dishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create dish');
  }

  const data = await response.json();
  return data.data || data;
}

async function updateDish(id: string, input: UpdateDishInput): Promise<Dish> {
  const response = await apiFetch(`/catalog/dishes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update dish');
  }

  const data = await response.json();
  return data.data || data;
}

async function deleteDish(id: string): Promise<void> {
  const response = await apiFetch(`/catalog/dishes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete dish');
  }
}

// Hooks
export function useDishes(filters?: DishFilters) {
  return useQuery({
    queryKey: [DISHES_KEY, filters],
    queryFn: () => fetchDishes(filters),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useDish(id: string) {
  return useQuery({
    queryKey: [DISHES_KEY, id],
    queryFn: () => fetchDishById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useDishBySlug(slug: string) {
  return useQuery({
    queryKey: [DISHES_KEY, 'slug', slug],
    queryFn: () => fetchDishBySlug(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDish,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DISHES_KEY] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData([DISHES_KEY, data.id], data);
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDishInput }) => 
      updateDish(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DISHES_KEY] });
      queryClient.setQueryData([DISHES_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [DISHES_KEY, 'slug'] });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDish,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [DISHES_KEY] });
      queryClient.removeQueries({ queryKey: [DISHES_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Featured dishes hooks
export function useHitDishes() {
  return useDishes({ isHit: true, limit: 100 });
}

export function useNewDishes() {
  return useDishes({ isNew: true, limit: 100 });
}

export function useDishesByCategory(categoryId: string) {
  return useDishes({ category: categoryId, limit: 100 });
}
