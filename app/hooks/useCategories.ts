/**
 * useCategories Hook - TanStack Query
 * Server state management for categories
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/app/types';
import { apiFetch, API_BASE } from '@/lib/api';
import { db, syncMenuToDB } from '@/app/lib/db';

const CATEGORIES_KEY = 'categories';

// API functions
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE}/catalog/categories`, {
      mode: 'cors',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      console.error('[fetchCategories] HTTP', response.status, errText);
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    const categories = Array.isArray(data) ? data : (data.data || []);
    await syncMenuToDB(categories, []).catch(() => {});
    return categories;
  } catch (err) {
    console.error('[fetchCategories] Error:', err);
    const cached = await db.categories.toArray();
    if (cached.length > 0) return cached;
    throw new Error('Failed to fetch categories and no cache available');
  }
}

async function fetchCategoryById(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/catalog/categories/${id}`, {
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  const data = await response.json();
  return data.data || data;
}

async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/catalog/categories/slug/${slug}`, {
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  const data = await response.json();
  return data.data || data;
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const response = await apiFetch('/catalog/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create category');
  }

  const data = await response.json();
  return data.data || data;
}

async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const response = await apiFetch(`/catalog/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update category');
  }

  const data = await response.json();
  return data.data || data;
}

async function deleteCategory(id: string): Promise<void> {
  const response = await apiFetch(`/catalog/categories/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete category');
  }
}

// Hooks
export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, id],
    queryFn: () => fetchCategoryById(id),
    enabled: !!id,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, 'slug', slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}
