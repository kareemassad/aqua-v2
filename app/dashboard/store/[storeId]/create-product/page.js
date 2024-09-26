"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    serial_number: "",
    id_number: "",
    cost_price: "",
    sell_price: "",
    image: "",
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
        store_id: params.storeId,
        cost_price: parseFloat(form.cost_price),
        sell_price: parseFloat(form.sell_price),
        inventory: parseInt(form.inventory, 10),
      });
      toast.success("Product created successfully");
      router.push(`/dashboard/store/${params.storeId}/product/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="text"
          name="serial_number"
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="id_number"
          placeholder="ID Number"
          value={form.id_number}
          onChange={handleChange}
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
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
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
          Create Product
        </button>
      </form>
    </main>
  );
};

export default CreateProduct;