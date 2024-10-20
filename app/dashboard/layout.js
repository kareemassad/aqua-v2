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
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar className="hidden md:block flex-shrink-0 border-r" />
        <div className="flex flex-col flex-grow w-full overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-2" />
          </header>
          <main className="flex-grow overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
