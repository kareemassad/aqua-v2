"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SelectCollectionModal({ isOpen, onClose, selectedProducts, onProductsAdded }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [activeTab, setActiveTab] = useState("existing");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get("/api/collections");
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError("Failed to fetch collections. Please try again.");
    }
  };

  const validateNewCollectionName = () => {
    if (!newCollectionName.trim()) {
      setError("Collection name cannot be empty");
      return false;
    }
    if (collections.some(collection => collection.name.toLowerCase() === newCollectionName.trim().toLowerCase())) {
      setError("A collection with this name already exists");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddToCollection = async () => {
    if (activeTab === "existing" && !selectedCollection) {
      setError("Please select a collection");
      return;
    }

    if (activeTab === "new" && !newCollectionName.trim()) {
      setError("Please enter a name for the new collection");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let collectionId = selectedCollection;

      if (activeTab === "new") {
        const newCollectionResponse = await axios.post("/api/collections", { name: newCollectionName.trim() });
        collectionId = newCollectionResponse.data._id;
      }

      // Use the new bulk add endpoint
      const response = await axios.post(`/api/collections/${collectionId}/items/bulk-create`, {
        product_ids: selectedProducts,
      });

      const { added, duplicates } = response.data;

      if (added > 0 && duplicates > 0) {
        toast.success(`Added ${added} product(s) to the collection. ${duplicates} product(s) were already in the collection.`);
      } else if (added > 0) {
        toast.success(`Added ${added} product(s) to the collection.`);
      } else if (duplicates === selectedProducts.length) {
        toast.warning(`No products added as all ${duplicates} product(s) were already in the collection.`);
      } else {
        toast.error("No products were added to the collection.");
      }

      onProductsAdded();
      onClose();
    } catch (error) {
      console.error("Error adding products to collection:", error);
      toast.error("An error occurred while adding products to the collection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCollection("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Products to Collection</DialogTitle>
          <DialogDescription>
            Select an existing collection or create a new one to add the selected products.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Collection</TabsTrigger>
            <TabsTrigger value="new">New Collection</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection._id} value={collection._id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          <TabsContent value="new">
            <Input
              type="text"
              placeholder="Enter new collection name"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value);
                setError("");
              }}
              onBlur={validateNewCollectionName}
            />
          </TabsContent>
        </Tabs>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddToCollection} disabled={isLoading || !!error}>
            {isLoading ? "Adding..." : "Add to Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}