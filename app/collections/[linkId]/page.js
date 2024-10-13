'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CollectionPage from '@/components/CollectionPage'
import LinkNavbar from '@/components/LinkNavbar'

export default function CollectionView() {
  const { linkId } = useParams()
  const [collection, setCollection] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collections/link/${linkId}`)
        setCollection(response.data.collection)
      } catch (err) {
        setError('Collection not found or invalid link.')
      }
    }

    fetchCollection()
  }, [linkId])

  if (error) return <div className="text-center text-red-500">{error}</div>
  if (!collection) return <div className="text-center">Loading...</div>

  return (
    <>
      <LinkNavbar />
      <CollectionPage collection={collection} />
    </>
  )
}
