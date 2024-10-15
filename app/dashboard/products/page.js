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
  Upload,
  Grid,
  List
} from 'lucide-react'
import { toast } from 'react-toastify'
import AddProductModal from '@/components/AddProductModal'
import SelectCollectionModal from '@/components/SelectCollectionModal'
import ProductTable from '@/components/ProductTable'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import ExcelUploadButton from '@/components/uploadthing/ExcelUploadButton'
import { ImageUploadModal } from '@/components/uploadthing/ImageUploadModal'

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
  const [view, setView] = useState('table')
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

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
        `/api/products/${editedProduct._id}`,
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
      const response = await axios.post(
        `/api/collections/${collectionId}/items`,
        {
          products: selectedProducts
        }
      )

      const data = response.data

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

  const handleExcelUpload = (url) => {
    console.log('Excel file uploaded:', url)
    toast.success('Excel file uploaded successfully. Processing data...')
  }

  const handleImageUpload = (productId) => {
    setSelectedProductId(productId)
    setIsImageUploadModalOpen(true)
  }

  const handleImageUploadModalOpen = (productId) => {
    setSelectedProductId(productId)
    setIsImageUploadModalOpen(true)
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <div className="space-x-2 flex items-center">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
          <Button onClick={() => setView(view === 'table' ? 'grid' : 'table')}>
            {view === 'table' ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
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
        <div>
          <Button
            onClick={handleAddToCollectionClick}
            disabled={selectedProducts.length === 0}
            variant="outline"
            className="mr-2"
          >
            <Boxes className="mr-2 h-4 w-4" />
            Add to Collection
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <Suspense
          fallback={<div className="text-center py-4">Loading products...</div>}
        >
          {view === 'table' ? (
            <ProductTable
              data={products}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              onProductEdit={handleProductEdit}
              onProductDelete={handleProductDelete}
              onImageUpload={handleImageUpload}
              onImageUploadComplete={fetchProducts}
            />
          ) : (
            <ProductGrid
              data={products}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              onProductEdit={handleProductEdit}
              onProductDelete={handleProductDelete}
            />
          )}
        </Suspense>
      )}

      <div className="flex justify-between items-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <ExcelUploadButton onUploadSuccess={handleExcelUpload} />
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

      {isImageUploadModalOpen && selectedProductId && (
        <ImageUploadModal
          isOpen={isImageUploadModalOpen}
          onClose={() => {
            setIsImageUploadModalOpen(false)
            setSelectedProductId(null)
          }}
          onUploadComplete={(imageKey) => {
            // Update the product in the local state if needed
            fetchProducts() // Refresh the product list
          }}
          productId={selectedProductId}
        />
      )}
    </div>
  )
}
