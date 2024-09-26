"use client";

import { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image"; // Added missing import

export default function SharedListPage() {
  const params = useParams();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const { cart, addToCart, removeFromCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/shared-lists/${params.unique_link}/validate`, { password });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert(error.response?.data?.error || "Invalid password"); // Consider replacing with a toast notification
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    // Implement checkout functionality (e.g., integrate with Stripe)
    alert("Checkout functionality to be implemented.");
  };

  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Enter Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shared Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border p-4 rounded">
                {product.image && (
                  <Image src={product.image} alt={product.name} width={200} height={200} className="object-cover rounded" />
                )}
                <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
                <p>Sell Price: ${product.sell_price.toFixed(2)}</p>
                <p>Inventory: {product.inventory}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 p-2 bg-green-500 text-white rounded"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
            {cart.length === 0 ? (
              <p>No products in cart.</p>
            ) : (
              <ul>
                {cart.map(item => (
                  <li key={item._id} className="flex justify-between items-center mb-2">
                    <span>{item.name} - ${item.sell_price}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="p-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cart.length > 0 && (
              <button
                onClick={handleCheckout}
                className="mt-4 p-2 bg-indigo-500 text-white rounded"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}