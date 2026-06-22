import { Suspense } from 'react';
import EditDishPage from './EditDishPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Загрузка...</div>}>
      <EditDishPage />
    </Suspense>
  );
}
