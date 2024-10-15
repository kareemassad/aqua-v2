'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings } from 'lucide-react'
import { toast } from 'react-toastify'
import ImageUploadButton from '@/components/uploadthing/ImageUploadButton'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState({
    email: '',
    storeName: '',
    storeDescription: '',
    profilePicture: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchAccountData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setIsLoading(true)
          const response = await axios.get(`/api/dashboard/account`)
          const { accountData } = response.data // Destructure accountData from response

          setUser({
            email: accountData.user.email,
            storeName: accountData.store.name,
            storeDescription: accountData.store.description || '',
            profilePicture: accountData.user.profilePicture || ''
          })
        } catch (error) {
          console.error('Error fetching account data:', error)
          toast.error('Failed to load account data. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchAccountData()
  }, [session, status])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/dashboard/account`, user)
      if (response.data && response.data.accountData) {
        setUser(response.data.accountData)
        toast.success('Account settings updated successfully!')
        setIsEditing(false)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error) {
      console.error('Error updating account data:', error)
      toast.error('Failed to update account settings. Please try again.')
    }
  }

  const handleProfilePictureUpload = ({ url }) => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePicture: url
    }))
  }

  if (status === 'loading' || isLoading) return <div>Loading...</div>
  if (!session) return <div>Please sign in to view your account.</div>

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={user.storeName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={user.storeDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <ImageUploadButton
                    endpoint="profileImage"
                    onClientUploadComplete={handleProfilePictureUpload}
                  />
                  {user.profilePicture && (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="mt-2 w-20 h-20 object-cover rounded-full"
                    />
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Store Name:</strong> {user.storeName}
                </p>
                {user.storeDescription && (
                  <p>
                    <strong>Store Description:</strong> {user.storeDescription}
                  </p>
                )}
                {user.profilePicture && (
                  <div>
                    <p>
                      <strong>Profile Picture:</strong>
                    </p>
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="mt-2 w-20 h-20 object-cover rounded-full"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mb-2 mr-2">
              View Billing History
            </Button>
            <Button variant="outline">Manage Payment Methods</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
