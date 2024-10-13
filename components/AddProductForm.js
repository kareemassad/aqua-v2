"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProductForm({ storeId, onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    sell_price: "",
    cost_price: "",
    inventory: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedCostPrice = parseFloat(form.cost_price);
      const parsedSellPrice = parseFloat(form.sell_price);
      const parsedInventory = parseInt(form.inventory, 10);

      // Validate parsed values
      if (
        isNaN(parsedCostPrice) ||
        isNaN(parsedSellPrice) ||
        isNaN(parsedInventory)
      ) {
        toast.error("Please enter valid numerical values.");
        return;
      }

      const payload = {
        ...form,
        store_id: storeId,
        cost_price: parsedCostPrice,
        sell_price: parsedSellPrice,
        inventory: parsedInventory,
      };

      const response = await axios.post("/api/products/create", payload);
      if (response.status === 201) {
        setForm({ name: "", sell_price: "", cost_price: "", inventory: 0 });
        toast.success("Product added successfully!");
        if (onProductAdded) onProductAdded(); // Notify parent component
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.error || "Failed to add product");
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
        name="cost_price"
        placeholder="Cost Price"
        value={form.cost_price}
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
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        Add Product
      </button>
    </form>
  );
}
