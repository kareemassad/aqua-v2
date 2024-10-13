'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Trash2, Share2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CollectionPage({ collection }) {
  const router = useRouter()
  const params = useParams()
  const { linkId } = params
  const [collectionState, setCollectionState] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collections/link/${linkId}`)
        setCollectionState(response.data.collection)
      } catch (err) {
        setError('Collection not found or invalid link.')
      }
    }

    fetchCollection()
  }, [linkId])

  if (error) return <div className="text-center text-red-500">{error}</div>
  if (!collectionState) return <div className="text-center">Loading...</div>

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `/api/collections/${collectionState._id}/items/${productId}`,
        {
          method: 'DELETE'
        }
      )
      if (response.ok) {
        toast.success('Product removed from collection.')
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to remove product.')
      }
    } catch (error) {
      console.error('Error removing product:', error)
      toast.error('An error occurred while removing the product.')
    }
  }

  const handleShareClick = () => {
    router.push('/dashboard/share')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{collectionState.name}</h1>
        <Button onClick={handleShareClick} variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          See your links
        </Button>
      </div>
      <p className="mb-4">{collectionState.description}</p>
      {collectionState.products.length === 0 ? (
        <p>No products in this collection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionState.products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.sell_price.toFixed(2)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteProduct(product._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
