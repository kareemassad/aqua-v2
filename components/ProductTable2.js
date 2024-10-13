import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cost Price</TableHead>
          <TableHead>Sell Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.cost_price.toFixed(2)}</TableCell>
            <TableCell>${product.sell_price.toFixed(2)}</TableCell>
            <TableCell>{product.inventory}</TableCell>
            <TableCell>
              <Button
                onClick={() => onEdit(product)}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(product._id)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
