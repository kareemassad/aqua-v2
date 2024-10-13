'use client'

import { CartProvider } from '@/contexts/CartContext'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </CartProvider>
    </SessionProvider>
  )
}
