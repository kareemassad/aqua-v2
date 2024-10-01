"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast"

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/collections');
      setCollections(response.data.collections);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setError("Failed to fetch collections");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load collections. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleExpand = useCallback((id) => {
    setExpandedCollection(prev => prev === id ? null : id);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
  };

  const handleSaveCollection = async (collection) => {
    try {
      const response = await axios.put(`/api/collections/${collection._id}`, { name: collection.name });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: 'Collection updated successfully',
        });
        fetchCollections();
        setEditingCollection(null);
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error",
        description: 'Error updating collection',
        variant: "destructive",
      });
    }
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        const response = await axios.delete(`/api/collections/${id}`);
        if (response.status === 200) {
          toast({
            title: "Success",
            description: 'Collection deleted successfully',
          });
          fetchCollections();
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast({
          title: "Error",
          description: 'Error deleting collection',
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFromCollection = async (collectionId, productId) => {
    try {
      await axios.delete(`/api/collections/${collectionId}/items/${productId}`);
      toast.success('Product removed from collection');
      fetchCollections();
    } catch (error) {
      console.error('Error removing product from collection:', error);
      toast.error('Error removing product from collection');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Collection
        </Button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Collection Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection._id}>
                <TableCell className="font-medium">{collection.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{collection.products.length}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(collection._id)}
                    >
                      {expandedCollection === collection._id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {expandedCollection === collection._id && (
                    <div className="mt-2 space-y-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="max-w-sm"
                      />
                      <div className="text-sm text-muted-foreground">
                        Showing {collection.products.length} products
                      </div>
                      <ul className="list-disc list-inside">
                        {collection.products.map(product => (
                          <li key={product._id}>
                            {product.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 text-red-500"
                              onClick={() => handleRemoveFromCollection(collection._id, product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCollection(collection)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Collection</DialogTitle>
                        <DialogDescription>
                          Make changes to the collection here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      {editingCollection && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Name
                            </label>
                            <Input
                              id="name"
                              value={editingCollection.name}
                              onChange={(e) => setEditingCollection({...editingCollection, name: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                      )}
                      <Button onClick={() => editingCollection && handleSaveCollection(editingCollection)}>
                        Save Changes
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCollection(collection._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}