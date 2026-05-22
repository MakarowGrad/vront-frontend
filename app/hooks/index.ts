/**
 * Hooks Index
 * Export all custom hooks
 */

export { useCart } from './useCart';
export { useFavorites } from './useFavorites';
export { useActiveCard } from './useActiveCard';
export {
  useDishes,
  useDish,
  useDishBySlug,
  useCreateDish,
  useUpdateDish,
  useDeleteDish,
  useHitDishes,
  useNewDishes,
  useDishesByCategory,
} from './useDishes';
export {
  useCategories,
  useCategory,
  useCategoryBySlug,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useActiveCategories,
} from './useCategories';
export {
  useOrders,
  useOrder,
  useUpdateOrderStatus,
} from './useOrders';
