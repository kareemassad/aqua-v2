"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from "react-hot-toast";
import AddProductModal from "@/components/AddProductModal";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!session) return;

      try {
        const response = await axios.get('/api/stores');
        // Assuming the response contains a list of stores, pick the first one or the appropriate store
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
      const response = await axios.get(`/api/products?page=${currentPage}&limit=10&search=${searchTerm}&store_id=${storeId}`);
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

  const handleProductAdded = () => {
    fetchProducts();
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Product</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.product_id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.cost_price.toFixed(2)}</TableCell>
              <TableCell>${product.sell_price.toFixed(2)}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product._id)}>
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
      />
    </div>
  );
}