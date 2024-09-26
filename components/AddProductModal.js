import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageDropZone from "@/components/uploadthing/ImageDropZone";

export default function AddProductModal({ isOpen, onClose, onProductAdded, storeId }) {
  const [form, setForm] = useState({
    name: "",
    id_number: "",
    cost_price: "",
    sell_price: "",
    inventory: 0,
    description: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = ({ type, url }) => {
    if (type === "image") {
      setImageUrl(url);
    }
    // Handle Excel upload success if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      store_id: storeId,
      image: imageUrl,
    };

    try {
      const response = await axios.post("/api/products/create", payload);
      toast.success("Product created successfully");
      onProductAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="id_number">ID Number (Optional)</Label>
            <Input
              id="id_number"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="cost_price">Cost Price</Label>
            <Input
              id="cost_price"
              name="cost_price"
              type="number"
              step="0.01"
              value={form.cost_price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="sell_price">Sell Price</Label>
            <Input
              id="sell_price"
              name="sell_price"
              type="number"
              step="0.01"
              value={form.sell_price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="inventory">Inventory</Label>
            <Input
              id="inventory"
              name="inventory"
              type="number"
              value={form.inventory}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Upload Image</Label>
            <ImageDropZone onUploadSuccess={handleUploadSuccess} />
          </div>
          {imageUrl && (
            <div>
              <p>Uploaded Image:</p>
              <img src={imageUrl} alt="Product" className="mt-2 h-32 w-32 object-cover" />
            </div>
          )}
          <Button type="submit">Create Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}