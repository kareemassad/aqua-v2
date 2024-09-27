"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateCollectionModal({ isOpen, onClose, selectedProducts, storeId }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name || !password) {
      toast.error("Name and password are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/collections/create", {
        store_id: storeId,
        name,
        password,
        // Optionally, include expiration_date or other fields
      });

      const CollectionId = response.data._id;

      // Add selected products to the shared list
      await Promise.all(selectedProducts.map(productId =>
        axios.post("/api/collections/items/create", {
          collection_id: CollectionId,
          product_id: productId,
          custom_price: 0, // Example: Set a default custom_price or collect from user
        })
      ));

      toast.success("Shared list created successfully");
      onClose();
    } catch (error) {
      console.error("Failed to create shared list:", error);
      toast.error(error.response?.data?.error || "Failed to create shared list");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Shared List</h2>
        <input
          type="text"
          placeholder="List Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          onClick={handleCreate}
          className="w-full p-2 bg-indigo-500 text-white rounded mb-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        <button
          onClick={onClose}
          className="w-full p-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}