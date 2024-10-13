// /components/ProductGrid.js
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon } from 'lucide-react'

export default function ProductGrid({
  data,
  onProductSelect,
  selectedProducts,
  onProductEdit,
  onProductDelete
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((product) => (
        <Card key={product._id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {product.name}
            </CardTitle>
            <Checkbox
              checked={selectedProducts.includes(product._id)}
              onCheckedChange={() => onProductSelect(product._id)}
            />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Price: ${product.sell_price.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Inventory: {product.inventory}
            </p>
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProductEdit(product)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProductDelete(product._id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
