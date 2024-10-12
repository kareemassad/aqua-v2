'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CollectionPage({ collection }) {
  const router = useRouter();
  const params = useParams();
  const { linkId } = params;
  const [collectionState, setCollectionState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collections/link/${linkId}`);
        setCollectionState(response.data.collection);
      } catch (err) {
        setError("Collection not found or invalid link.");
      }
    };

    fetchCollection();
  }, [linkId]);

  if (error) return <div>{error}</div>;
  if (!collectionState) return <div>Loading...</div>;

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/collections/${collectionState._id}/items/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Product removed from collection.');
        // Optionally, refresh the page or update state
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to remove product.');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('An error occurred while removing the product.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{collectionState.name}</h1>
      <p>{collectionState.description}</p>
      {collectionState.products.length === 0 ? (
        <p>No products in this collection.</p>
      ) : (
        <ul>
          {collectionState.products.map(product => (
            <li key={product._id} className="flex justify-between items-center mb-2">
              <span>{product.name} - ${product.sell_price.toFixed(2)}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
