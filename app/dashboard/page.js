'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  BarChart,
  Package,
  Link as LinkIcon,
  CreditCard,
  Settings,
  Search,
  Bell,
  User,
  DollarSign,
  Bookmark,
  ShoppingCart,
  BarChart2
} from 'lucide-react'
import { toast } from 'react-toastify'
import { Progress } from '@/components/ui/progress'

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

  const recentActivity = [
    {
      id: 1,
      action: 'New listing',
      item: 'Rare 1928 Gold Certificate',
      time: '5 minutes ago'
    },
    {
      id: 2,
      action: 'Price update',
      item: 'Antique Silver Coin',
      time: '2 hours ago'
    },
    {
      id: 3,
      action: 'Sold',
      item: 'Vintage Stamp Collection',
      time: '1 day ago'
    },
    {
      id: 4,
      action: 'New collection',
      item: 'European Artifacts',
      time: '2 days ago'
    }
  ]

  if (status === 'loading' || isLoading) return <div>Loading...</div>
  if (!session) return <div>Please sign in to view the dashboard.</div>
  if (!dashboardData)
    return <div>No data found. Please try refreshing the page.</div>

  return (
    <div className="space-y-6">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${user.totalSales.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Listings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.productCount}</div>
              <p className="text-xs text-muted-foreground">+15 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                4 require attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Links
              </CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.activeLinks}</div>
              <p className="text-xs text-muted-foreground">
                +10.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Placeholder for a chart */}
              <div className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center">
                Sales Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.item}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="text-right">Stock Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: 'Product A',
                    category: 'Electronics',
                    revenue: '$12,000',
                    sales: 1234,
                    stock: 85
                  },
                  {
                    name: 'Product B',
                    category: 'Clothing',
                    revenue: '$10,500',
                    sales: 876,
                    stock: 32
                  },
                  {
                    name: 'Product C',
                    category: 'Home & Garden',
                    revenue: '$8,200',
                    sales: 654,
                    stock: 60
                  }
                ].map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.revenue}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell className="text-right">
                      <Progress
                        value={product.stock}
                        className="w-[80px] ml-auto"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Link href="/dashboard/products">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Package className="mr-2 h-4 w-4" /> Manage Products
              </Button>
            </Link>
            <Link href="/dashboard/share">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <LinkIcon className="mr-2 h-4 w-4" /> Generate Shareable Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
