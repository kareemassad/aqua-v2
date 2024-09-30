"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from 'lucide-react';
import { toast } from "react-hot-toast";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections');
      setCollections(response.data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Error fetching collections');
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await axios.delete(`/api/collections/${collectionId}`);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Error deleting collection');
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection._id}>
              <TableCell>{collection.name}</TableCell>
              <TableCell>
                {collection.products.length === 0 ? (
                  <span>No products in this collection.</span>
                ) : (
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
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCollection(collection._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}