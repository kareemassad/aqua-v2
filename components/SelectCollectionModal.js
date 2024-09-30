"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SelectCollectionModal({ isOpen, onClose, selectedProducts, storeId }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionPassword, setNewCollectionPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections');
      setCollections(response.data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error('Error fetching collections.');
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection && !newCollectionName) {
      toast.error("Please select an existing collection or enter a new collection name.");
      return;
    }

    if (newCollectionName && !newCollectionPassword) {
      toast.error("Please enter a password for the new collection.");
      return;
    }

    try {
      let collectionId = selectedCollection;

      // If creating a new collection
      if (newCollectionName) {
        const createResponse = await axios.post('/api/collections', {
          store_id: storeId, // Ensure storeId is passed
          name: newCollectionName,
          password: newCollectionPassword,
        });
        collectionId = createResponse.data._id;
      }

      // Add selected products to the collection
      await Promise.all(selectedProducts.map(productId =>
        axios.post(`/api/collections/${collectionId}/items/create`, {
          product_id: productId,
          custom_price: 0, // Adjust as needed
        })
      ));

      toast.success("Products added to the collection successfully.");
      onClose();
    } catch (error) {
      console.error("Error adding products to collection:", error);
      toast.error(error.response?.data?.error || "Failed to add products to collection.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select or Create a Collection</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Choose an existing collection</label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="">-- Select a Collection --</option>
                {collections.map(collection => (
                  <option key={collection._id} value={collection._id}>{collection.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Or create a new collection</label>
              <Input
                placeholder="New Collection Name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newCollectionPassword}
                onChange={(e) => setNewCollectionPassword(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddToCollection}>Add to Collection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}