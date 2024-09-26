"use client";

import { useState } from "react";
import axios from "axios";

export default function AddProductForm({ storeId }) {
  const [form, setForm] = useState({
    name: "",
    sell_price: "",
    inventory: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/products/create", {
        ...form,
        store_id: storeId,
      });
      if (response.status === 201) {
        // Optionally, refresh the product list
        // e.g., emit an event or use a state management solution
        setForm({ name: "", sell_price: "", inventory: 0 });
        // Notify the user
        alert("Product added successfully!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        step="0.01"
        name="sell_price"
        placeholder="Sell Price"
        value={form.sell_price}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="inventory"
        placeholder="Inventory Count"
        value={form.inventory}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        Add Product
      </button>
    </form>
  );
}