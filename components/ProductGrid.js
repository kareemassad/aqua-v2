// /components/ProductGrid.js
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function ProductGrid({
  data,
  onProductSelect,
  selectedProducts,
  onProductEdit,
  onProductDelete
}) {
  const [editingProduct, setEditingProduct] = useState(null)
  const [editedValues, setEditedValues] = useState({})

  const handleEdit = (product) => {
    setEditingProduct(product._id)
    setEditedValues(product)
  }

  const handleSave = async () => {
    await onProductEdit(editedValues)
    setEditingProduct(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((product) => (
        <Card key={product._id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Price: ${product.sell_price}</p>
            <Checkbox
              checked={selectedProducts.includes(product._id)}
              onCheckedChange={() => onProductSelect(product._id)}
            />
          </CardContent>
          <CardFooter>
            {editingProduct === product._id ? (
              <>
                <Input
                  value={editedValues.name}
                  onChange={(e) =>
                    setEditedValues({ ...editedValues, name: e.target.value })
                  }
                />
                <Input
                  value={editedValues.sell_price}
                  onChange={(e) =>
                    setEditedValues({
                      ...editedValues,
                      sell_price: e.target.value
                    })
                  }
                />
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(product)}
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
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
