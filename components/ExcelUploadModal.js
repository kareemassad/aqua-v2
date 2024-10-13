"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ExcelDropZone from "@/components/uploadthing/ExcelDropZone";
import { toast } from "react-hot-toast";

export default function ExcelUploadModal({ onImportSuccess }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUploadSuccess = async ({ mappings, data }) => {
    try {
      const response = await fetch("/api/products/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mappings, data }),
      });

      if (response.ok) {
        toast.success("Products imported successfully!");
        setIsOpen(false);
        onImportSuccess();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to import products.");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("An error occurred while importing products.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Upload Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
        </DialogHeader>
        <ExcelDropZone onUploadSuccess={handleUploadSuccess} />
      </DialogContent>
    </Dialog>
  );
}