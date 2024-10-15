'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

export default function NormalizeDataPage() {
  const searchParams = useSearchParams()
  const fileUrl = searchParams.get('fileUrl')
  const [data, setData] = useState(null)

  useEffect(() => {
    if (fileUrl) {
      // Fetch and process the Excel data
      // This is where you'd implement your data normalization logic
      // For now, we'll just log the file URL
      console.log('Excel file URL:', fileUrl)
      toast.info('Processing Excel file...')
    }
  }, [fileUrl])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Normalize Excel Data</h1>
      {/* Add your data normalization UI here */}
    </div>
  )
}
