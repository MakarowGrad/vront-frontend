import EditDishPage from './EditDishPage';

export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function Page() {
  return <EditDishPage />;
}
