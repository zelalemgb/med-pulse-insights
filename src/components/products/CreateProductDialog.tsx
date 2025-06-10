
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  code?: string;
  category: string;
  unit: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a mock product for now - this would integrate with Supabase later
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        code: data.code || `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        category: data.category,
        unit: data.unit,
        unitPrice: data.unitPrice,
        venClassification: data.venClassification,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      reset();
      onSuccess(newProduct);
      onOpenChange(false);
      
      toast({
        title: "Product Created",
        description: `${data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Pharmaceutical Product</DialogTitle>
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
              <Input
                id="unit"
                {...register('unit', { required: 'Unit is required' })}
                placeholder="e.g., Tablets, Capsules, ml"
              />
              {errors.unit && (
                <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unitPrice">Unit Price (USD) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice', { 
                  required: 'Unit price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                placeholder="0.00"
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.unitPrice.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="venClassification">VEN Classification *</Label>
              <Select onValueChange={(value) => setValue('venClassification', value as 'V' | 'E' | 'N')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VEN classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V">V - Vital</SelectItem>
                  <SelectItem value="E">E - Essential</SelectItem>
                  <SelectItem value="N">N - Non-essential</SelectItem>
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
              placeholder="Enter product description (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
