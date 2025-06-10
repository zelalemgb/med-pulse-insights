
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateProduct } from '@/hooks/useProducts';

interface ProductFormData {
  name: string;
  code?: string;
  category: string;
  unit: string;
  packageSize: number;
  unitPrice: number;
  venClassification: 'V' | 'E' | 'N';
  description?: string;
}

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (product: any) => void;
}

export const CreateProductDialog = ({ open, onOpenChange, onSuccess }: CreateProductDialogProps) => {
  const createProduct = useCreateProduct();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log('Form data submitted:', data);
      const product = await createProduct.mutateAsync(data);
      reset();
      onSuccess(product);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Pharmaceutical Product</DialogTitle>
          <DialogDescription>
            Add a new pharmaceutical product to the system catalog
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="code">Product Code</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Enter product code (optional)"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...register('category', { required: 'Category is required' })}
                placeholder="e.g., Antibiotic, Analgesic"
              />
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select onValueChange={(value) => setValue('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="capsules">Capsules</SelectItem>
                  <SelectItem value="vials">Vials</SelectItem>
                  <SelectItem value="ampoules">Ampoules</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="ml">Milliliters (ml)</SelectItem>
                  <SelectItem value="mg">Milligrams (mg)</SelectItem>
                  <SelectItem value="sachets">Sachets</SelectItem>
                  <SelectItem value="strips">Strips</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-600 mt-1">Unit is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="packageSize">Package Size *</Label>
              <Input
                id="packageSize"
                type="number"
                {...register('packageSize', { 
                  required: 'Package size is required',
                  min: { value: 1, message: 'Package size must be at least 1' },
                  valueAsNumber: true
                })}
                placeholder="e.g., 10, 20, 100"
              />
              {errors.packageSize && (
                <p className="text-sm text-red-600 mt-1">{errors.packageSize.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Number of units per package</p>
            </div>

            <div>
              <Label htmlFor="unitPrice">Unit Price (USD) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice', { 
                  required: 'Unit price is required',
                  min: { value: 0, message: 'Price must be positive' },
                  valueAsNumber: true
                })}
                placeholder="0.00"
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.unitPrice.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="venClassification">VEN Classification *</Label>
              <Select onValueChange={(value) => setValue('venClassification', value as 'V' | 'E' | 'N')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VEN classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V">V - Vital (Life-saving medicines)</SelectItem>
                  <SelectItem value="E">E - Essential (Important for healthcare)</SelectItem>
                  <SelectItem value="N">N - Non-essential (Used for minor conditions)</SelectItem>
                </SelectContent>
              </Select>
              {errors.venClassification && (
                <p className="text-sm text-red-600 mt-1">VEN classification is required</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description, indications, contraindications, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createProduct.isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createProduct.isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createProduct.isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
