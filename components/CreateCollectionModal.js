"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateCollectionModal({ isOpen, onClose, selectedProducts, storeId }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      toast.error("Collection name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/collections", {
        store_id: storeId,
        name,
      });

      const collectionId = response.data._id;

      // Add selected products to the collection
      await Promise.all(selectedProducts.map(productId =>
        axios.post(`/api/collections/${collectionId}/items/create`, {
          product_id: productId
        })
      ));

      toast.success("Collection created successfully");
      onClose();
    } catch (error) {
      console.error("Failed to create collection:", error);
      toast.error(error.response?.data?.error || "Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection Name"
            required
          />
        </div>
        <Button onClick={handleCreate} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Collection"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}