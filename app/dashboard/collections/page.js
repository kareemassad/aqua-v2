'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import SelectCollectionModal from "@/components/SelectCollectionModal"

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {
        await fetchCollections();
        await fetchAllProducts();
      }
    };
    fetchData();
  }, [status]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      } else {
        toast.error('Failed to fetch collections');
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Error fetching collections');
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data.products || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  const handleAddToCollectionClick = () => {
    if (selectedProductIds.length === 0) {
      toast.error('Please select at least one product to add to a collection.');
      return;
    }
    setIsAddProductModalOpen(true);
  };

  const handleRemoveProduct = async (productId) => {
    // Implement the logic to remove a product from a collection
    try {
      const response = await fetch(`/api/collections/${productId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Product removed successfully');
        await fetchCollections(); // Refresh the collections after removal
      } else {
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Error removing product');
    }
  };

  const handleProductsAdded = (productIds) => {
    setSelectedProductIds(productIds);
  };

  const handleRenameCollection = async (id, newName) => {
    // Implement the logic to rename a collection
    // This function should be called when the "Rename" button is clicked in the AG Grid
    try {
      const response = await fetch(`/api/collections/${id}`, { method: 'PUT', body: JSON.stringify({ name: newName }) });
      if (response.ok) {
        toast.success('Collection renamed successfully');
        await fetchCollections(); // Refresh the collections after renaming
      } else {
        toast.error('Failed to rename collection');
      }
    } catch (error) {
      console.error('Error renaming collection:', error);
      toast.error('Error renaming collection');
    }
  };

  const columnDefs = [
    { headerName: "Product Name", field: "name" },
    { headerName: "Price", field: "sell_price", valueFormatter: params => `$${params.value.toFixed(2)}` },
    {
      headerName: "Actions",
      cellRendererFramework: (params) => (
        <Button variant="ghost" size="sm" onClick={() => handleRemoveProduct(params.data._id)}>
          Remove
        </Button>
      ),
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button onClick={() => handleRenameCollection('new', 'New Collection')}>
          New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <p className="text-center text-gray-500 my-4">No collections found. Create a new collection to get started.</p>
      ) : (
        collections.map((collection) => (
          <Card key={collection._id} className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{collection.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={collection.products}
                  columnDefs={columnDefs}
                  rowSelection="multiple"
                  onGridReady={params => params.api.sizeColumnsToFit()}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
      <Button
        onClick={handleAddToCollectionClick}
        disabled={selectedProductIds.length === 0}
        variant="outline"
        className="ml-4 flex items-center gap-2"
      >
        Add to Collection
      </Button>
      <SelectCollectionModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        selectedProducts={selectedProductIds}
        onProductsAdded={handleProductsAdded}
      />
    </div>
  );
}