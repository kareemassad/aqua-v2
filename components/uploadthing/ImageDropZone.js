'use client'

import { useDropzone } from '@uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { useCallback } from 'react'

export default function ImageDropZone({ onUploadSuccess }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles)
      if (onUploadSuccess) {
        onUploadSuccess({ type: 'image', url: acceptedFiles[0].fileUrl })
      }
    },
    [onUploadSuccess]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*'])
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag &apos;n&apos; drop an image here, or click to select one</p>
    </div>
  )
}
