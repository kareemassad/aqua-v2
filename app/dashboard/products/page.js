"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, CheckIcon, TrashIcon, Boxes, Plus } from 'lucide-react';
import { toast } from "react-hot-toast";
import AddProductModal from "@/components/AddProductModal";
import SelectCollectionModal from "@/components/SelectCollectionModal";

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
      console.log('API response:', response.data);
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

  const handleEdit = (productId) => {
    if (editingProduct === productId) {
      // Save the changes
      handleSaveEdit(productId);
    } else {
      setEditingProduct(productId);
    }
  };

  const handleSaveEdit = async (productId) => {
    try {
      const productToUpdate = products.find(p => p._id === productId);
      await axios.put(`/api/products/${productId}`, productToUpdate);
      setEditingProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const handleInputChange = (productId, field, value) => {
    setProducts(products.map(p => 
      p._id === productId ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
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
          <Boxes className="h-4 w-4" />
          Add to Collection
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts(products.map(product => product._id));
                  } else {
                    setSelectedProducts([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => handleSelectProduct(product._id)}
                />
              </TableCell>
              <TableCell>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded" />
                ) : (
                  <div className="h-12 w-12 bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-700">No Image</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    value={product.name}
                    onChange={(e) => handleInputChange(product._id, 'name', e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    type="number"
                    value={product.sell_price}
                    onChange={(e) => handleInputChange(product._id, 'sell_price', parseFloat(e.target.value))}
                  />
                ) : (
                  `$${product.sell_price.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    type="number"
                    value={product.inventory}
                    onChange={(e) => handleInputChange(product._id, 'inventory', parseInt(e.target.value))}
                  />
                ) : (
                  product.inventory
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(product._id)}>
                    {editingProduct === product._id ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
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

      <SelectCollectionModal
        isOpen={isSelectCollectionOpen}
        onClose={() => setIsSelectCollectionOpen(false)}
        selectedProducts={selectedProducts}
        storeId={storeId}
      />
    </div>
  );
}