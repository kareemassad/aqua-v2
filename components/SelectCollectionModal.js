'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SelectCollectionModal({
  isOpen,
  onClose,
  selectedProducts,
  storeId,
  onSelectCollection
}) {
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [activeTab, setActiveTab] = useState('existing')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchCollections()
    }
  }, [isOpen])

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections')
      setCollections(response.data.collections || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
      setError('Failed to fetch collections. Please try again.')
    }
  }

  const validateNewCollectionName = () => {
    if (!newCollectionName.trim()) {
      setError('Collection name cannot be empty')
      return false
    }
    if (
      collections.some(
        (collection) =>
          collection.name.toLowerCase() ===
          newCollectionName.trim().toLowerCase()
      )
    ) {
      setError('A collection with this name already exists')
      return false
    }
    setError('')
    return true
  }

  const handleAddToCollection = async () => {
    if (activeTab === 'existing' && !selectedCollection) {
      setError('Please select a collection')
      return
    }

    if (activeTab === 'new' && !validateNewCollectionName()) {
      return
    }

    setIsLoading(true)
    try {
      let collectionId
      if (activeTab === 'new') {
        // Create a new collection
        const response = await axios.post('/api/collections', {
          name: newCollectionName,
          storeId
        })
        collectionId = response.data._id
      } else {
        collectionId = selectedCollection
      }

      // Call the onSelectCollection prop function
      await onSelectCollection(collectionId)

      onClose()
      toast.success('Products added to collection successfully')
    } catch (error) {
      console.error('Error adding products to collection:', error)
      setError('Failed to add products to collection. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Products to Collection</DialogTitle>
          <DialogDescription>
            Select an existing collection or create a new one to add the
            selected products.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Collection</TabsTrigger>
            <TabsTrigger value="new">New Collection</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <Select
              value={selectedCollection}
              onValueChange={setSelectedCollection}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection._id} value={collection._id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          <TabsContent value="new">
            <Input
              type="text"
              placeholder="Enter new collection name"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value)
                setError('')
              }}
              onBlur={validateNewCollectionName}
            />
          </TabsContent>
        </Tabs>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToCollection}
            disabled={isLoading || !!error}
          >
            {isLoading ? 'Adding...' : 'Add to Collection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
