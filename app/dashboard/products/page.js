import ProductTable from '@/app/components/ProductTable';
import Link from 'next/link';

export default function ProductDashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Product Dashboard</h1>
      <div className="mt-4 mb-4">
        <Link href="/dashboard/products/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Product
        </Link>
      </div>
      <ProductTable />
    </div>
  );
}
