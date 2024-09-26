"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
const SharedList = require('../../../models/SharedList');
const SharedListItem = require('../../../models/SharedListItem');

const SharedProducts = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedProducts = async () => {
    try {
      const response = await axios.get(`/api/shared-lists/${params.unique_link}`);
      setProducts(response.data.products);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch shared products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedProducts();
  }, [params.unique_link]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shared Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              {product.image && (
                <Image src={product.image} alt={product.name} width={200} height={200} className="object-cover rounded" />
              )}
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p>Serial Number: {product.serial_number}</p>
              <p>ID Number: {product.id_number}</p>
              <p>Cost Price: ${product.cost_price.toFixed(2)}</p>
              <p>Sell Price: ${product.custom_price.toFixed(2)}</p>
              <p>Inventory: {product.inventory}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default SharedProducts;