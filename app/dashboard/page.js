'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Package,
  Link as LinkIcon,
  CreditCard,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState({
    productCount: 0,
    activeLinks: 0,
    pendingOrders: 0,
    totalSales: 0,
    email: '',
    storeName: ''
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setIsLoading(true)
          const response = await axios.get(`/api/dashboard`)
          setDashboardData(response.data)
          setUser((prevUser) => ({
            ...prevUser,
            email: response.data.user.email,
            storeName: response.data.store.name,
            productCount: response.data.store.productCount
          }))
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
          toast.error('Failed to load dashboard data. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchDashboardData()
  }, [session, status])

  if (status === 'loading' || isLoading) return <div>Loading...</div>
  if (!session) return <div>Please sign in to view the dashboard.</div>
  if (!dashboardData)
    return <div>No data found. Please try refreshing the page.</div>

  // Render your dashboard content here using the dashboardData state
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.activeLinks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${user.totalSales.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link href="/dashboard/products">
              <Button className="w-full">Manage Products</Button>
            </Link>
            <Link href="/dashboard/generate-link">
              <Button className="w-full">Generate Shareable Link</Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button className="w-full">View Orders</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Store Name:</strong> {user.storeName}
            </p>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="mt-4">
                <Settings className="mr-2 h-4 w-4" />
                Edit Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
