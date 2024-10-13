import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Switch } from '@/components/ui/switch' // Assuming you have a Switch component
import { useSession } from 'next-auth/react'

const StoreSettings = ({ store }) => {
  const [isPublic, setIsPublic] = useState(store.public)
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (session?.user?.id) {
        const response = await axios.get(`/api/subscription/${session.user.id}`)
        setSubscription(response.data.subscription)
      }
    }
    fetchSubscription()
  }, [session])

  const handleTogglePublic = async () => {
    try {
      const response = await axios.put(`/api/stores/${store._id}`, {
        public: !isPublic
      })
      setIsPublic(response.data.public)
      toast.success(
        `Store is now ${response.data.public ? 'public' : 'private'}`
      )
    } catch (error) {
      console.error('Error updating store visibility:', error)
      toast.error('Failed to update store visibility.')
    }
  }

  return (
    <div>
      {subscription?.plan === 'Discover' && (
        <div>
          <label className="flex items-center">
            <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
            <span className="ml-2">Public Store</span>
          </label>
        </div>
      )}
    </div>
  )
}

export default StoreSettings
