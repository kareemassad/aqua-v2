"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilIcon, CheckIcon, TrashIcon } from 'lucide-react';

export default function ProductTable({ data, onProductSelect, selectedProducts, onProductEdit, onProductDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditedProduct(product);
  };

  const handleSave = async () => {
    await onProductEdit(editedProduct);
    setEditingId(null);
  };

  const handleChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">
              <Checkbox
                checked={selectedProducts.length === data.length && data.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onProductSelect(data.map(product => product._id));
                  } else {
                    onProductSelect([]);
                  }
                }}
              />
            </th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Sell Price</th>
            <th className="px-6 py-3">Cost Price</th>
            <th className="px-6 py-3">Inventory</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4">
                <Checkbox
                  checked={selectedProducts.includes(product._id)}
                  onCheckedChange={() => onProductSelect(product._id)}
                />
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Input
                    value={editedProduct.name}
                    onChange={(e) => handleChange(e, 'name')}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Input
                    type="number"
                    value={editedProduct.sell_price}
                    onChange={(e) => handleChange(e, 'sell_price')}
                  />
                ) : (
                  `$${product.sell_price.toFixed(2)}`
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Input
                    type="number"
                    value={editedProduct.cost_price}
                    onChange={(e) => handleChange(e, 'cost_price')}
                  />
                ) : (
                  `$${product.cost_price.toFixed(2)}`
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Input
                    type="number"
                    value={editedProduct.inventory}
                    onChange={(e) => handleChange(e, 'inventory')}
                  />
                ) : (
                  product.inventory
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Input
                    value={editedProduct.description}
                    onChange={(e) => handleChange(e, 'description')}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product._id ? (
                  <Button onClick={handleSave} variant="ghost" size="sm">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => handleEdit(product)} variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={() => onProductDelete(product._id)} variant="ghost" size="sm">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
