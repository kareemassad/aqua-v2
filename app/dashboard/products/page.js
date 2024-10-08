"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ExcelDropZone from "@/components/uploadthing/ExcelDropZone";
import ProductTable from "@/components/ProductTable";
import { toast } from "react-hot-toast";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);

  const handleUploadSuccess = (parsedData) => {
    setProducts(parsedData);
    toast.success("Excel file parsed successfully!");
  };

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Product Dashboard</h1>
      <ExcelDropZone onUploadSuccess={handleUploadSuccess} />
      {products.length > 0 && <ProductTable data={products} />}
    </div>
  );
}