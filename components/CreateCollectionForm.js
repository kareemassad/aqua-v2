'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateCollectionForm() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Collection name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/collections', {
        name,
      });

      if (response.status === 201) {
        toast.success("Collection created successfully!");
        setName('');
        // Optionally, refresh collection list or perform other actions
      } else {
        toast.error("Failed to create collection");
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error(error.response?.data?.error || "An error occurred while creating the collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection Name"
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Collection"}
      </Button>
    </form>
  );
}