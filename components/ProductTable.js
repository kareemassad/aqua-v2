'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  UploadIcon
} from 'lucide-react'
import { ImageUploadModal } from '@/components/uploadthing/ImageUploadModal'
import { getImageUrl } from '@/lib/uploadthing' // Added import

export default function ProductTable({
  data,
  onProductSelect,
  selectedProducts,
  onProductEdit,
  onProductDelete,
  onImageUpload,
  onImageUploadComplete // Existing prop
}) {
  const [editingProduct, setEditingProduct] = useState(null)
  const [editedValues, setEditedValues] = useState({})
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  const handleEdit = (product) => {
    setEditingProduct(product._id)
    setEditedValues(product)
  }

  const handleSave = async () => {
    await onProductEdit(editedValues)
    setEditingProduct(null)
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setEditedValues({})
  }

  const handleInputChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value })
  }

  const handleImageUpload = (productId) => {
    console.log('Opening ImageUploadModal for productId:', productId)
    setSelectedProductId(productId)
    setIsImageUploadModalOpen(true)
  }

  const handleImageUploadComplete = async (imageKey) => {
    // Changed parameter to imageKey
    try {
      await onImageUpload(selectedProductId, imageKey) // Updated to use selectedProductId
      toast.success('Product image uploaded successfully')
      setIsImageUploadModalOpen(false)
      setSelectedProductId(null)
    } catch (error) {
      console.error('Error updating product image:', error)
      toast.error('Failed to update product image')
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProducts.length === data.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onProductSelect(data.map((product) => product._id))
                  } else {
                    onProductSelect([])
                  }
                }}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product._id)}
                  onCheckedChange={() => onProductSelect(product._id)}
                />
              </TableCell>
              <TableCell>
                {product.imageKey ? ( // Changed from product.image to product.imageKey
                  <Image
                    src={getImageUrl(product.imageKey)} // Use getImageUrl to construct the URL
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-cover rounded cursor-pointer"
                    onClick={() => handleImageUpload(product._id)}
                  />
                ) : (
                  <div
                    className="w-[50px] h-[50px] bg-gray-200 flex items-center justify-center rounded cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => handleImageUpload(product._id)}
                  >
                    <UploadIcon className="text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    value={editedValues.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    type="number"
                    value={editedValues.inventory}
                    onChange={(e) =>
                      handleInputChange('inventory', parseInt(e.target.value))
                    }
                  />
                ) : (
                  product.inventory
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    type="number"
                    value={editedValues.cost_price}
                    onChange={(e) =>
                      handleInputChange(
                        'cost_price',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  `$${product.cost_price.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <Input
                    type="number"
                    value={editedValues.sell_price}
                    onChange={(e) =>
                      handleInputChange(
                        'sell_price',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  `$${product.sell_price.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {editingProduct === product._id ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleSave}>
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onProductDelete(product._id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isImageUploadModalOpen && selectedProductId && (
        <ImageUploadModal
          isOpen={isImageUploadModalOpen}
          onClose={() => {
            setIsImageUploadModalOpen(false)
            setSelectedProductId(null)
          }}
          onUploadComplete={handleImageUploadComplete} // Use the updated handler
          productId={selectedProductId}
        />
      )}
    </>
  )
}
