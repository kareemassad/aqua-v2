'use client'

import { useState, useEffect, Suspense } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PencilIcon,
  CheckIcon,
  TrashIcon,
  Boxes,
  Plus,
  Upload
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import AddProductModal from '@/components/AddProductModal'
import SelectCollectionModal from '@/components/SelectCollectionModal'
import ExcelUploadModal from '@/components/ExcelUploadModal'
import ProductTable from '@/components/ProductTable'

export default function ProductsPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [storeId, setStoreId] = useState(null)
  const [isSelectCollectionOpen, setIsSelectCollectionOpen] = useState(false)
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!session) return
      try {
        const response = await axios.get('/api/stores')
        if (response.data.stores && response.data.stores.length > 0) {
          setStoreId(response.data.stores[0]._id)
        } else {
          toast.error('No store found for the user.')
        }
      } catch (error) {
        console.error('Error fetching store ID:', error)
        toast.error('Error fetching store information')
      }
    }
    fetchStoreId()
  }, [session])

  useEffect(() => {
    if (storeId) {
      fetchProducts()
    }
  }, [currentPage, searchTerm, storeId])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `/api/products?page=${currentPage}&limit=10&search=${searchTerm}`
      )
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportSuccess = () => {
    fetchProducts()
    setIsExcelUploadOpen(false)
  }

  const handleAddToCollectionClick = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product to add to a collection.')
      return
    }
    setIsSelectCollectionOpen(true)
  }

  const handleProductSelect = (productIds) => {
    if (Array.isArray(productIds)) {
      setSelectedProducts(productIds)
    } else {
      setSelectedProducts((prevSelected) => {
        if (prevSelected.includes(productIds)) {
          return prevSelected.filter((id) => id !== productIds)
        } else {
          return [...prevSelected, productIds]
        }
      })
    }
  }

  const handleProductEdit = async (editedProduct) => {
    try {
      const response = await axios.put(
        `/api/products/${editedProduct.product_id}`,
        editedProduct
      )
      if (response.status === 200) {
        toast.success('Product updated successfully')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Error updating product')
    }
  }

  const handleProductDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`/api/products/${productId}`)
        if (response.status === 200) {
          toast.success('Product deleted successfully')
          fetchProducts()
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Error deleting product')
      }
    }
  }

  const handleProductAdded = () => {
    fetchProducts()
    setIsAddModalOpen(false)
    toast.success('Product added successfully')
  }

  const handleAddToCollection = async (collectionId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: selectedProducts })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add products to collection')
      }

      if (data.addedCount > 0) {
        toast.success(
          `Added ${data.addedCount} product${data.addedCount !== 1 ? 's' : ''} to the collection`
        )
      } else {
        toast.info('No new products were added to the collection')
      }

      if (data.alreadyInCollection > 0) {
        toast.info(
          `${data.alreadyInCollection} product${data.alreadyInCollection !== 1 ? 's were' : ' was'} already in the collection`
        )
      }

      setSelectedProducts([])
      setIsSelectCollectionOpen(false)
    } catch (error) {
      console.error('Error adding products to collection:', error)
      toast.error(error.message || 'Failed to add products to collection')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
          <Button onClick={() => setIsExcelUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Excel
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={handleAddToCollectionClick}
          disabled={selectedProducts.length === 0}
          variant="outline"
          className="ml-4 flex items-center gap-2"
        >
          <Boxes className="h-4 w-4" />
          Add to Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <Suspense
          fallback={<div className="text-center py-4">Loading products...</div>}
        >
          <ProductTable
            data={products}
            onProductSelect={handleProductSelect}
            selectedProducts={selectedProducts}
            onProductEdit={handleProductEdit}
            onProductDelete={handleProductDelete}
          />
        </Suspense>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
        storeId={storeId}
      />

      <SelectCollectionModal
        isOpen={isSelectCollectionOpen}
        onClose={() => setIsSelectCollectionOpen(false)}
        selectedProducts={selectedProducts}
        storeId={storeId}
        onSelectCollection={handleAddToCollection}
      />

      <ExcelUploadModal
        isOpen={isExcelUploadOpen}
        onClose={() => setIsExcelUploadOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
}
