'use client'

import { UploadButton } from '@uploadthing/react'
import { toast } from 'react-toastify'

export default function ExcelDropZone({ onUploadSuccess }) {
  return (
    <UploadButton
      endpoint="excelUploader"
      onClientUploadComplete={(res) => {
        console.log('Upload completed:', res)
        if (
          res &&
          res[0] &&
          res[0].serverData &&
          res[0].serverData.parsedData
        ) {
          onUploadSuccess(res[0].serverData.parsedData)
          toast.success('Excel file uploaded and parsed successfully!')
        } else {
          console.error('Unexpected response format:', res)
          toast.error(
            'Failed to parse the Excel file. Please check the file format.'
          )
        }
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error)
        toast.error('Failed to upload the Excel file. Please try again.')
      }}
    />
  )
}
