import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, API_BASE } from '@/lib/api';

const BLOCKED_SLOTS_KEY = 'blockedSlots';

export interface BlockedSlot {
  id: string;
  date: string;
  timeSlots: string[];
  isFullDay: boolean;
  reason?: string;
  createdAt: string;
}

async function fetchBlockedSlots(month?: string): Promise<BlockedSlot[]> {
  const params = month ? `?month=${month}` : '';
  const response = await apiFetch(`/admin/blocked-slots${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blocked slots');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.data || []);
}

async function fetchBlockedSlotsForDate(date: string): Promise<BlockedSlot[]> {
  const response = await fetch(`${API_BASE}/blocked-slots?date=${date}`, {
    credentials: 'include',
    mode: 'cors',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch blocked slots for date');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.data || []);
}

async function createBlockedSlot(payload: {
  date: string;
  timeSlots?: string[];
  isFullDay?: boolean;
  reason?: string;
}): Promise<BlockedSlot> {
  const response = await apiFetch('/admin/blocked-slots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create blocked slot');
  }
  return response.json();
}

async function deleteBlockedSlot(id: string): Promise<void> {
  const response = await apiFetch(`/admin/blocked-slots/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete blocked slot');
  }
}

export function useBlockedSlots(month?: string) {
  return useQuery({
    queryKey: [BLOCKED_SLOTS_KEY, month],
    queryFn: () => fetchBlockedSlots(month),
    staleTime: 30 * 1000,
  });
}

export function useBlockedSlotsForDate(date: string) {
  return useQuery({
    queryKey: [BLOCKED_SLOTS_KEY, 'date', date],
    queryFn: () => fetchBlockedSlotsForDate(date),
    enabled: !!date,
    staleTime: 30 * 1000,
  });
}

async function fetchBlockedSlotsForMonth(month: string): Promise<BlockedSlot[]> {
  const response = await fetch(`${API_BASE}/blocked-slots/month?month=${month}`, {
    credentials: 'include',
    mode: 'cors',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch blocked slots for month');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.data || []);
}

export function useBlockedSlotsForMonth(month: string) {
  return useQuery({
    queryKey: [BLOCKED_SLOTS_KEY, 'month', month],
    queryFn: () => fetchBlockedSlotsForMonth(month),
    enabled: !!month,
    staleTime: 30 * 1000,
  });
}

export function useCreateBlockedSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlockedSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOCKED_SLOTS_KEY] });
    },
  });
}

export function useDeleteBlockedSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlockedSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOCKED_SLOTS_KEY] });
    },
  });
}
