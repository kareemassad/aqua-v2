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
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';

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
  const [editingProductId, setEditingProductId] = useState(null); // Track the editing product ID

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

  const handleProductAdded = () => {
    fetchProducts();
    setIsAddModalOpen(false);
  };

  const handleAddToCollectionClick = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to add to the collection.");
      return;
    }
    setIsSelectCollectionOpen(true);
  };

  const handleEdit = (productId) => {
    if (editingProductId === productId) {
      setEditingProductId(null); // Save the changes and exit edit mode
    } else {
      setEditingProductId(productId); // Enter edit mode
    }
  };

  const handleSaveEdit = async (productId) => {
    const productToUpdate = products.find(p => p._id === productId);
    
    // Validate inputs
    if (productToUpdate.cost_price < 0 || productToUpdate.sell_price < 0 || productToUpdate.inventory < 0) {
      toast.error('Cost, Sell Price, and Inventory cannot be negative.');
      return;
    }

    try {
      await axios.put(`/api/products/${productId}`, productToUpdate);
      setEditingProductId(null); // Exit edit mode
      toast.success('Product updated successfully');
      fetchProducts(); // Refresh the product list to reflect changes
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        editingProductId === row.original._id ? (
          <Input
            value={row.original.name}
            onChange={(e) => {
              const updatedProducts = products.map(product =>
                product._id === row.original._id ? { ...product, name: e.target.value } : product
              );
              setProducts(updatedProducts);
            }}
          />
        ) : (
          row.original.name
        )
      ),
    },
    {
      accessorKey: 'cost_price',
      header: 'Cost Price',
      cell: ({ row }) => (
        editingProductId === row.original._id ? (
          <Input
            type="number"
            value={row.original.cost_price}
            onChange={(e) => {
              const updatedProducts = products.map(product =>
                product._id === row.original._id ? { ...product, cost_price: Math.max(0, parseFloat(e.target.value)) } : product
              );
              setProducts(updatedProducts);
            }}
          />
        ) : (
          `$${row.original.cost_price.toFixed(2)}`
        )
      ),
    },
    {
      accessorKey: 'sell_price',
      header: 'Sell Price',
      cell: ({ row }) => (
        editingProductId === row.original._id ? (
          <Input
            type="number"
            value={row.original.sell_price}
            onChange={(e) => {
              const updatedProducts = products.map(product =>
                product._id === row.original._id ? { ...product, sell_price: Math.max(0, parseFloat(e.target.value)) } : product
              );
              setProducts(updatedProducts);
            }}
          />
        ) : (
          `$${row.original.sell_price.toFixed(2)}`
        )
      ),
    },
    {
      accessorKey: 'inventory',
      header: 'Inventory',
      cell: ({ row }) => (
        editingProductId === row.original._id ? (
          <Input
            type="number"
            value={row.original.inventory}
            onChange={(e) => {
              const updatedProducts = products.map(product =>
                product._id === row.original._id ? { ...product, inventory: Math.max(0, parseInt(e.target.value)) } : product
              );
              setProducts(updatedProducts);
            }}
          />
        ) : (
          row.original.inventory
        )
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original._id)}>
            {editingProductId === row.original._id ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original._id)}>
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
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