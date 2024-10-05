'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Link, Search, Plus, Edit } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [editingCollection, setEditingCollection] = useState(null)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [collectionSearchTerms, setCollectionSearchTerms] = useState({})
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCollections()
      fetchAllProducts()
    }
  }, [status])

  const fetchCollections = async () => {
    const response = await fetch('/api/collections')
    if (response.ok) {
      const data = await response.json()
      console.log("Fetched collections:", data.collections)
      setCollections(data.collections)
    }
  }

  const fetchAllProducts = async () => {
    const response = await fetch('/api/products')
    if (response.ok) {
      const data = await response.json()
      setAllProducts(data.products)
    }
  }

  const handleRenameCollection = async (id, newName) => {
    if (id === 'new') {
      // Create a new collection
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName, 
          password: 'temporary'
        })
      })
      if (response.ok) {
        const newCollection = await response.json()
        setCollections([...collections, newCollection])
      } else {
        console.error('Failed to create collection:', await response.text())
      }
    } else {
      // Rename existing collection
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })
      if (response.ok) {
        setCollections(collections.map(collection => 
          collection._id === id ? { ...collection, name: newName } : collection
        ))
      } else {
        console.error('Failed to rename collection:', await response.text())
      }
    }
    setEditingCollection(null)
  }

  const handleDeleteCollection = async (id) => {
    const response = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
    if (response.ok) {
      setCollections(collections.filter(collection => collection._id !== id))
    }
  }

  const handleRemoveProduct = async (collectionId, productId) => {
    const response = await fetch(`/api/collections/${collectionId}/items/${productId}`, { method: 'DELETE' })
    if (response.ok) {
      setCollections(collections.map(collection => 
        collection._id === collectionId 
          ? { ...collection, products: collection.products.filter(product => product._id !== productId) }
          : collection
      ))
    }
  }

  const handleAddProducts = async (collectionId) => {
    const promises = selectedProducts.map(product => 
      fetch(`/api/collections/${collectionId}/items/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product._id, custom_price: product.price })
      })
    )
    await Promise.all(promises)
    fetchCollections() // Refresh the collections after adding products
    setSelectedProducts([])
    setIsAddProductModalOpen(false)
  }

  const handleGenerateLink = async (collectionId) => {
    const response = await fetch(`/api/collections/${collectionId}/generate-link`, { method: 'POST' })
    if (response.ok) {
      const { safeLink } = await response.json()
      console.log(`Safe link generated: ${safeLink}`)
      // You might want to update the UI to show this link
    }
  }

  const handleCollectionSearch = (collectionId, searchTerm) => {
    setCollectionSearchTerms({
      ...collectionSearchTerms,
      [collectionId]: searchTerm
    })
  }

  const filteredCollections = collections.map(collection => ({
    ...collection,
    products: collection.products.filter(product => 
      product.name.toLowerCase().includes((collectionSearchTerms[collection._id] || '').toLowerCase())
    )
  }))

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button onClick={() => handleRenameCollection('new', 'New Collection')}>
          <Plus className="mr-2 h-4 w-4" /> New Collection
        </Button>
      </div>

      {filteredCollections.map((collection) => (
        <Card key={collection._id} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            {editingCollection === collection._id ? (
              <Input
                value={collection.name}
                onChange={(e) => handleRenameCollection(collection._id, e.target.value)}
                onBlur={() => setEditingCollection(null)}
                autoFocus
              />
            ) : (
              <CardTitle>{collection.name}</CardTitle>
            )}
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingCollection(collection._id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteCollection(collection._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search products in this collection..."
                value={collectionSearchTerms[collection._id] || ''}
                onChange={(e) => handleCollectionSearch(collection._id, e.target.value)}
                className="max-w-sm"
                icon={<Search className="mr-2 h-4 w-4" />}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collection.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Image src={product.image || '/placeholder.svg'} alt={product.name} width={50} height={50} className="rounded-md" />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.inventory}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(collection._id, product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {collection.products.length === 0 && (
              <p className="text-center text-gray-500 my-4">No products found in this collection.</p>
            )}
            <div className="mt-4 flex justify-between">
              <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Products
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Products to Collection</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                    {filteredProducts.map((product) => (
                      <div key={product._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product._id}`}
                          checked={selectedProducts.some(p => p._id === product._id)}
                          onCheckedChange={(checked) => {
                            setSelectedProducts(
                              checked
                                ? [...selectedProducts, product]
                                : selectedProducts.filter(p => p._id !== product._id)
                            )
                          }}
                        />
                        <label
                          htmlFor={`product-${product._id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {product.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleAddProducts(collection._id)}>Add Selected Products</Button>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateLink(collection._id)}
              >
                <Link className="mr-2 h-4 w-4" /> Generate Safe Link
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}