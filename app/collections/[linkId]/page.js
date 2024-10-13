'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

const CollectionPage = () => {
  const params = useParams()
  const { linkId } = params
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

  if (error) return <div>{error}</div>
  if (!collection) return <div>Loading...</div>

  return (
    <div>
      <h1>{collection.name}</h1>
      <p>{collection.description}</p>
      {/* Render products in the collection */}
      <ul>
        {collection.products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.sell_price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CollectionPage
