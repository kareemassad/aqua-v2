"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreateStore = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    contact_info: {},
  });
  const [stores, setStores] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/stores", form);
      toast.success("Store created successfully");
      router.push(`/dashboard/store/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create store");
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/stores');
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Store</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Store Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="logo"
          placeholder="Logo URL"
          value={form.logo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {/* Add fields for contact_info as needed */}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Create Store
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8">Existing Stores</h2>
      <ul className="list-disc pl-5">
        {stores.map(store => (
          <li key={store._id}>{store.name} - {store.description}</li>
        ))}
      </ul>
    </main>
  );
};

export default CreateStore;