"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddProductForm from "@/components/AddProductForm";
import UploadExcelForm from "@/components/UploadExcelForm";
import ProductList from "@/components/ProductList";
import CreateSharedListModal from "@/components/CreateSharedListModal";
import { toast } from "react-toastify"; // Ensure react-toastify is installed and configured

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`/api/user/${userData?.id}/dashboard`);
      setUserData(response.data.user);
      setStore(response.data.store);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  useEffect(() => {
    // Fetch userData from session or context
    const fetchUser = async () => {
      try {
        const sessionResponse = await axios.get("/api/auth/session");
        setUserData(sessionResponse.data.user);
      } catch (error) {
        console.error("Error fetching user session:", error);
        toast.error("Failed to fetch user session");
      }
    };
    fetchUser();
  }, []);

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userData?.name}</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Account Details</h2>
        <p>Email: {userData?.email}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Store Details</h2>
        <p>Name: {store?.name}</p>
        <p>Description: {store?.description}</p>
        <p>Contact Information: {store?.contact}</p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Your Products</h2>
        {products.length > 0 ? (
          <ProductList
            products={products}
            selectedProducts={selectedProducts}
            onSelect={handleProductSelect}
          />
        ) : (
          <div>
            <p>No products found. Add some products to get started!</p>
            <AddProductForm storeId={store?._id} />
            <UploadExcelForm storeId={store?._id} />
          </div>
        )}
        {/* Button to open Shared List Modal */}
        {products.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 p-2 bg-indigo-500 text-white rounded"
            disabled={selectedProducts.length === 0}
          >
            Create Shared List
          </button>
        )}

        <CreateSharedListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedProducts={selectedProducts}
          storeId={store?._id} // Passed the storeId prop
        />
      </section>
    </div>
  );
}