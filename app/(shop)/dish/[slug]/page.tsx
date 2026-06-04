import DishPage from './DishPage';

export async function generateStaticParams() {
  try {
    const res = await fetch('https://makarowgrad-vront-backend-53ee.twc1.net/api/catalog/dishes');
    const data = await res.json();
    return data.data.map((dish: any) => ({ slug: dish.slug }));
  } catch {
    return [];
  }
}

export default function Page() {
  return <DishPage />;
}
