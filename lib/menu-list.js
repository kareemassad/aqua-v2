import {
  BarChart2,
  Package,
  Bookmark,
  Users,
  Settings,
  Share2,
  PlusCircle,
  Boxes,
  FileSpreadsheet
} from 'lucide-react'

export function getMenuList() {
  return [
    {
      groupLabel: 'Main',
      menus: [{ href: '/dashboard', label: 'Dashboard', icon: BarChart2 }]
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/dashboard/products',
          label: 'Inventory',
          icon: Boxes,
          submenus: [
            {
              href: '/dashboard/products',
              label: 'My Products',
              icon: Package
            },
            {
              href: '/dashboard/products/new',
              label: 'Create New Product',
              icon: PlusCircle
            },
            {
              label: 'Import from CSV',
              icon: FileSpreadsheet,
              href: '/dashboard/products/normalize'
            }
          ]
        },
        {
          href: '/dashboard/collections',
          label: 'Collections',
          icon: Bookmark
        },
        {
          href: '/dashboard/share',
          label: 'Share',
          icon: Share2
        }
      ]
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/dashboard/customers',
          label: 'Customers',
          icon: Users
        }
      ]
    }
  ]
}
