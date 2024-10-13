// /components/BulkEditModal.js
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BulkEditModal({
  isOpen,
  onClose,
  onBulkEdit,
  selectedProductsCount
}) {
  const [editData, setEditData] = useState({
    sell_price: '',
    cost_price: '',
    inventory: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const filteredData = Object.fromEntries(
      Object.entries(editData).filter(([_, value]) => value !== '')
    )
    onBulkEdit(filteredData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit {selectedProductsCount} Products</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="sell_price"
            type="number"
            placeholder="Sell Price"
            value={editData.sell_price}
            onChange={handleChange}
          />
          <Input
            name="cost_price"
            type="number"
            placeholder="Cost Price"
            value={editData.cost_price}
            onChange={handleChange}
          />
          <Input
            name="inventory"
            type="number"
            placeholder="Inventory"
            value={editData.inventory}
            onChange={handleChange}
          />
          <Button type="submit">Apply Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
