// app/api/uploadthing/core.js
import { createUploadthing } from 'uploadthing/next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/next-auth'
import { UploadThingError } from 'uploadthing/server'
import { toast } from 'react-toastify'

const f = createUploadthing()

const getSession = async () => {
  const session = await getServerSession(authOptions)
  if (!session) throw new UploadThingError('Unauthorized')
  return { userId: session.user.id }
}

export const uploadRouter = {
  strictProfileImage: f({
    image: { maxFileSize: '2MB', maxFileCount: 1, minFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      const session = await getSession()
      if (!session) throw new UploadThingError('Unauthorized')
      // Anything returned will be available in the onUploadComplete function.
      return { userId: session.userId }
    })
    .onUploadError((error) => {
      console.log('Upload error:', error)
      throw error
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
      // Whatever is returned here will be returned from the api endpoint (callback).
      return { uploadedBy: metadata.userId }
    }),

  //csv files only
  csvUploader: f({
    text: {
      maxFileSize: '1MB',
      maxFileCount: 1,
      accept: [
        // Only accept csv files.
        'text/csv'
      ]
    }
  })
    .middleware(async ({ req }) => {
      const session = await getSession()
      if (!session) throw new UploadThingError('Unauthorized')
      return { userId: session.userId }
    })
    .onUploadError((error) => {
      console.log('Upload error:', error)
      toast.error('Upload error:', error)
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Excel/CSV upload complete for userId:', metadata.userId)
      console.log('file url', file.key)
      return { uploadedBy: metadata.userId, fileKey: file.key }
    }),

  productImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const session = await getSession()
      if (!session) throw new UploadThingError('Unauthorized')
      return { userId: session.userId }
    })
    .onUploadError((error) => {
      console.log('Upload error:', error)
      toast.error('Upload error:', error)
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Image upload complete for userId:', metadata.userId)
      console.log('imageKey', file.key)
      return { uploadedBy: metadata.userId, imageKey: file.key }
    })
}
