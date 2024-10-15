// components/uploadthing/ImageUploadButton.js
'use client'

import { useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'
import { toast } from 'react-toastify'

export default function ImageUploadButton({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false)

  return (
    <UploadButton
      endpoint="strictProfileImage"
      onUploadBegin={() => setIsUploading(true)}
      onClientUploadComplete={(res) => {
        setIsUploading(false)
        if (res && res[0] && res[0].url) {
          onUploadSuccess(res[0].url)
          toast.success('Profile image uploaded successfully!')
        } else {
          console.error('Unexpected response format:', res)
          toast.error('Failed to upload the profile image. Please try again.')
        }
      }}
      onUploadError={(error) => {
        setIsUploading(false)
        console.error('Upload error:', error)
        toast.error('Failed to upload the profile image. Please try again.')
      }}
    >
      {({ isUploading: isUploadingInternal, startUpload }) => (
        <button
          onClick={startUpload}
          disabled={isUploading || isUploadingInternal}
        >
          {isUploading || isUploadingInternal
            ? 'Uploading...'
            : 'Upload Profile Image'}
        </button>
      )}
    </UploadButton>
  )
}
