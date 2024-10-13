'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Share2, ShoppingCart, User, Boxes } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/collections', label: 'Collections', icon: Boxes },
  { href: '/dashboard/share', label: 'Share', icon: Share2 },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/account', label: 'Account', icon: User }
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-between px-4 py-3 bg-background border-b">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button
            variant={pathname === item.href ? 'default' : 'ghost'}
            className="flex items-center space-x-2"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  )
}
