"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import AddProductModal from "@/components/AddProductModal";
import SelectCollectionModal from "@/components/SelectCollectionModal";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [isSelectCollectionOpen, setIsSelectCollectionOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!session) return;
      try {
        const response = await axios.get('/api/stores');
        if (response.data.stores && response.data.stores.length > 0) {
          setStoreId(response.data.stores[0]._id);
        } else {
          toast.error("No store found for the user.");
        }
      } catch (error) {
        console.error('Error fetching store ID:', error);
        toast.error('Error fetching store information');
      }
    };
    fetchStoreId();
  }, [session]);

  useEffect(() => {
    if (storeId) {
      fetchProducts();
    }
  }, [currentPage, searchTerm, storeId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?page=${currentPage}&limit=10&search=${searchTerm}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find(p => p._id === productId);
    setEditingProduct(productToEdit);
    setIsAddModalOpen(true); // Open the modal to edit the product
  };

  const handleProductAdded = () => {
    fetchProducts();
    setIsAddModalOpen(false);
    setEditingProduct(null); // Reset editing product
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleAddToCollectionClick = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product to add to a collection.');
      return;
    }
    setIsSelectCollectionOpen(true);
  };

  const columnDefs = [
    { headerName: "Select", checkboxSelection: true, width: 100 },
    { headerName: "Image", field: "imageUrl", cellRenderer: params => params.value ? `<img src="${params.value}" style="width: 50px; height: 50px;"/>` : 'No Image', width: 100 },
    { headerName: "Name", field: "name", editable: true },
    { headerName: "Sell Price", field: "sell_price", valueFormatter: params => `$${params.value.toFixed(2)}`, editable: true },
    { headerName: "Inventory", field: "inventory", editable: true },
    {
      headerName: "Actions",
      cellRendererFramework: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.data._id)}>Edit</Button>
          <Button onClick={() => handleDelete(params.data._id)}>Delete</Button>
        </div>
      ),
      width: 150
    }
  ];

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add New Product
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={handleAddToCollectionClick}
          disabled={selectedProducts.length === 0}
          variant="outline"
          className="ml-4 flex items-center gap-2"
        >
          Add to Collection
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={products}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onGridReady={params => params.api.sizeColumnsToFit()}
        />
      </div>

      {products.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No products found. Add a new product to get started.
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
        storeId={storeId}
        product={editingProduct} // Pass the product to edit
      />

      <SelectCollectionModal
        isOpen={isSelectCollectionOpen}
        onClose={() => setIsSelectCollectionOpen(false)}
        selectedProducts={selectedProducts}
        storeId={storeId}
      />
    </div>
  );
}