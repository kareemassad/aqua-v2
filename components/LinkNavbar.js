import Link from 'next/link'
import { ShoppingCart, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="Your Logo" />
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="mr-2">
                <Home className="h-5 w-5 mr-1" />
                Home
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
