import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import config from '@/config'
import { Sidebar } from '@/components/Sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar'

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
export default async function LayoutPrivate({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(config.auth.loginUrl)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="w-64 border-r" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
