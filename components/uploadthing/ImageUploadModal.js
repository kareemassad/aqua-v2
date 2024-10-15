'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/lib/uploadthing'
import { toast } from 'react-toastify'
import axios from 'axios'

export function ImageUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  productId
}) {
  const [isUploading, setIsUploading] = useState(false)

  console.log('ImageUploadModal received productId:', productId)

  const handleUploadComplete = async (res) => {
    setIsUploading(false)
    if (res && res[0] && res[0].key) {
      try {
        console.log(
          'Attempting to update product:',
          productId,
          'with imageKey:',
          res[0].key
        )
        const response = await axios.put(`/api/products/${productId}`, {
          imageKey: res[0].key
        })
        if (response.data.success) {
          onUploadComplete(res[0].key)
          onClose()
          toast.success('Product image updated successfully')
        } else {
          throw new Error('Failed to update product')
        }
      } catch (error) {
        console.error(
          'Error updating product:',
          error.response?.data || error.message
        )
        toast.error('Failed to update the product with the new image.')
      }
    } else {
      toast.error('Failed to upload the image. Please try again.')
    }
  }

  const handleUploadError = (error) => {
    setIsUploading(false)
    toast.error(error.message || 'An error occurred while uploading the image.')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Product Image</DialogTitle>
        </DialogHeader>
        <UploadDropzone
          endpoint="productImage"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          onUploadBegin={() => setIsUploading(true)}
        />
        {isUploading && <p>Uploading...</p>}
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  )
}
