// components/ExcelUploadButton.js
'use client'

import { useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function ExcelUploadButton({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  return (
    <UploadButton
      endpoint="csvUploader"
      onUploadBegin={() => setIsUploading(true)}
      onClientUploadComplete={(res) => {
        setIsUploading(false)
        if (res && res[0] && res[0].url) {
          onUploadSuccess(res[0].url)
          toast.success('File uploaded successfully!')
          router.push(`/dashboard/products/normalize?fileUrl=${res[0].url}`)
        } else {
          console.error('Unexpected response format:', res)
          toast.error(
            `Failed to upload file: Unexpected response format - ${JSON.stringify(res)}`
          )
        }
      }}
      onUploadError={(error) => {
        setIsUploading(false)
        console.error('Upload error:', error)
        let errorMessage = 'Failed to upload file. Please try again.'
        if (error.message.includes('404')) {
          errorMessage =
            'Upload endpoint not found. Please check server configuration.'
        } else if (error.message.includes('Failed to parse response')) {
          errorMessage =
            'Server returned an invalid response. Please try again or contact support.'
        } else if (error.message.includes('Invalid file type')) {
          errorMessage =
            'Invalid file type. Please upload an Excel (.xlsx) or CSV file.'
        }
        toast.error(errorMessage)
      }}
    >
      {({ isUploading: isUploadingInternal, startUpload }) => (
        <Button
          onClick={startUpload}
          disabled={isUploading || isUploadingInternal}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading || isUploadingInternal
            ? 'Uploading...'
            : 'Upload Excel/CSV'}
        </Button>
      )}
    </UploadButton>
  )
}
