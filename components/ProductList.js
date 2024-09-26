// components/ProductList.js

"use client";

import React from "react";

export default function ProductList({ products, selectedProducts, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded flex flex-col">
          {product.image && (
            <img src={product.image} alt={product.name} width={200} height={200} className="object-cover rounded mb-2" />
          )}
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p>Sell Price: ${product.sell_price.toFixed(2)}</p>
          <p>Inventory: {product.inventory}</p>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => onSelect(product._id)}
              className="mr-2"
            />
            Select
          </label>
        </div>
      ))}
    </div>
  );
}