'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import ExcelDropZone from '@/components/uploadthing/ExcelDropZone'
import { toast } from 'react-hot-toast'

export default function ExcelUploadModal({ isOpen, onClose, onImportSuccess }) {
  const handleUploadSuccess = async ({ mappings, data }) => {
    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mappings, data })
      })

      if (response.ok) {
        toast.success('Products imported successfully!')
        onClose()
        onImportSuccess()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to import products.')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('An error occurred while importing products.')
    }
  }

  const handleOpenChange = (open) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
        </DialogHeader>
        <ExcelDropZone onUploadSuccess={handleUploadSuccess} />
      </DialogContent>
    </Dialog>
  )
}
