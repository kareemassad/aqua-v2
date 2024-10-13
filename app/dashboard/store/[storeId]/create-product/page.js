"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import AddProductModal from "@/components/AddProductModal";

const CreateProduct = () => {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductAdded = () => {
    setIsModalOpen(false);
    // Optionally, refresh the product list or perform other actions
    toast.success("Product created successfully");
    router.push(`/dashboard/stores/${params.storeId}/products`);
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Product</h1>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        Add Product
      </Button>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
        storeId={params.storeId}
      />
    </main>
  );
};

export default CreateProduct;
