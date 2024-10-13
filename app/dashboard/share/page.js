'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Copy, BarChart2 } from 'lucide-react'

export default function SharePage() {
  const [collections, setCollections] = useState([])
  const [links, setLinks] = useState([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    fetchCollections()
    fetchLinks()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/collections')
      setCollections(response.data.collections)
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    }
  }

  const fetchLinks = async () => {
    try {
      const response = await axios.get('/api/links')
      setLinks(response.data.links)
    } catch (error) {
      console.error('Error fetching links:', error)
      toast.error('Failed to fetch links')
    }
  }

  const handleCreateLink = async () => {
    if (!selectedCollection) {
      toast.error('Please select a collection')
      return
    }

    try {
      const response = await axios.post(
        `/api/collections/${selectedCollection}/generate-link`,
        {
          isPublic
        }
      )
      toast.success('Link created successfully')
      fetchLinks()
    } catch (error) {
      console.error('Error creating link:', error)
      toast.error(error.response?.data?.error || 'Failed to create link')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Collection Links</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
        <div className="flex items-center gap-4 mb-4">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select a collection</option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection._id}>
                {collection.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              id="public-switch"
            />
            <label htmlFor="public-switch">Public</label>
          </div>
          <Button onClick={handleCreateLink}>Create Link</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Links</h2>
        {links.length === 0 ? (
          <p>No links created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <Card key={link._id}>
                <CardHeader>
                  <CardTitle>{link.collectionId.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    <strong>Type:</strong>{' '}
                    {link.isPublic ? 'Public' : 'Private'}
                  </p>
                  <p className="mb-2 flex items-center">
                    <strong>Link:</strong>
                    <span className="ml-2 text-blue-500 truncate">
                      {`${window.location.origin}/collections/${link.linkId}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/collections/${link.linkId}`
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </p>
                  <p className="mb-2">
                    <strong>Clicks:</strong> {link.clickCount}
                  </p>
                  <p className="mb-2">
                    <strong>Created:</strong>{' '}
                    {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                  {link.lastClickedAt && (
                    <p className="mb-2">
                      <strong>Last Clicked:</strong>{' '}
                      {new Date(link.lastClickedAt).toLocaleString()}
                    </p>
                  )}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `${window.location.origin}/collection/${link.linkId}`,
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="h-4 w-4 mr-2" /> Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
