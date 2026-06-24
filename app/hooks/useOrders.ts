import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, API_BASE } from '@/lib/api';

const ORDERS_KEY = 'orders';

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentType?: string;
  deliveryAddress?: any;
  pickupTime?: string;
  specialInstructions?: string;
  internalNotes?: string;
  completedAt?: string;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
  customer: {
    id: string;
    name: string | null;
    phone: string;
    email?: string;
  };
  items: Array<{
    id: string;
    dishId?: string;
    quantity: number;
    price: number;
    unitPrice?: number;
    totalPrice?: number;
    specialInstructions?: string;
    dish: {
      id?: string;
      title: string;
      coverImage: string | null;
      image?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

async function fetchOrderById(orderId: string): Promise<Order> {
  const response = await apiFetch(`/orders/${orderId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function fetchOrders(): Promise<Order[]> {
  const response = await apiFetch('/admin/orders');
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function updateOrderStatus({ orderId, status }: { orderId: string; status: string }): Promise<Order> {
  const response = await apiFetch(`/admin/orders/${orderId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update order status');
  }
  
  return response.json();
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [ORDERS_KEY, orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
}

export function useOrders() {
  return useQuery({
    queryKey: [ORDERS_KEY],
    queryFn: fetchOrders,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
