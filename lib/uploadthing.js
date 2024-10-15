import { generateReactHelpers } from '@uploadthing/react'

export const { useUploadThing, uploadFiles } = generateReactHelpers()

export { UploadButton, UploadDropzone, Uploader } from '@uploadthing/react'

// Utility function to generate image URLs
export const getImageUrl = (imageKey, size = 'original') => {
  const baseUrl = 'https://utfs.io/f/'
  switch (size) {
    case 'thumbnail':
      return `${baseUrl}${imageKey}?w=100&h=100&fit=crop`
    case 'medium':
      return `${baseUrl}${imageKey}?w=300&h=300&fit=crop`
    case 'large':
      return `${baseUrl}${imageKey}?w=800&h=800&fit=contain`
    default:
      return `${baseUrl}${imageKey}`
  }
}
