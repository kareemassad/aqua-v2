// components/Sidebar.jsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getMenuList } from '@/lib/menu-list'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuAction
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronRight,
  ChevronsUpDown,
  LifeBuoy,
  Send,
  LogOut,
  BadgeCheck,
  CreditCard,
  Bell
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import AccountModal from '@/components/AccountModal'

export function Sidebar({ className }) {
  const { data: session } = useSession()
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const pathname = usePathname()
  const menuList = getMenuList()

  return (
    <ShadcnSidebar className={cn('w-64 shrink-0', className)}>
      <SidebarHeader className="space-y-2 py-4 px-3">
        <h2 className="px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        {menuList.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
              {group.menus.map((menu, menuIndex) => (
                <Collapsible key={menuIndex} asChild>
                  <SidebarMenuItem>
                    {menu.submenus ? (
                      <>
                        <SidebarMenuButton>
                          {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                          <span>{menu.label}</span>
                        </SidebarMenuButton>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menu.submenus.map((submenu, submenuIndex) => (
                              <SidebarMenuSubItem key={submenuIndex}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === submenu.href}
                                >
                                  <Link href={submenu.href}>
                                    {/* Add the submenu icon */}
                                    {submenu.icon && (
                                      <submenu.icon className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{submenu.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === menu.href}
                        tooltip={menu.label}
                      >
                        <Link href={menu.href}>
                          {menu.icon && <menu.icon className="mr-2 h-4 w-4" />}
                          <span>{menu.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <Link href="/support">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <Link href="/feedback">
                    <Send className="mr-2 h-4 w-4" />
                    <span>Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session?.user?.image || '/avatars/user.png'}
                      alt={session?.user?.name || 'User'}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || 'User Name'}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email || 'user@example.com'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setIsAccountModalOpen(true)}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit">Log out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* Account Modal */}
      {isAccountModalOpen && (
        <AccountModal
          onClose={() => setIsAccountModalOpen(false)}
          user={session?.user}
        />
      )}
    </ShadcnSidebar>
  )
}
