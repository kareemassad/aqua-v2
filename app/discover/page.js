'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

const DiscoverPage = () => {
  const [stores, setStores] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPublicStores = async () => {
      try {
        const response = await axios.get('/api/stores/public')
        setStores(response.data.stores)
      } catch (err) {
        setError('Failed to fetch public stores.')
      }
    }

    fetchPublicStores()
  }, [])

  if (error) return <div>{error}</div>
  if (stores.length === 0) return <div>No public stores available.</div>

  return (
    <div>
      <h1>Discover Stores</h1>
      <ul>
        {stores.map((store) => (
          <li key={store._id}>
            <a href={`/collections/${store.uniqueLinkId}`}>{store.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DiscoverPage
