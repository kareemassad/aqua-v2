"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadExcelForm({ storeId }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("storeId", storeId);

    try {
      const response = await axios.post("/api/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        alert("Products imported successfully!");
        setFile(null);
        // Optionally, refresh the product list
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      alert(error.response?.data?.error || "Failed to upload Excel file");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Upload Excel
      </button>
    </form>
  );
}