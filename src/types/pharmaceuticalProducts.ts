
export interface PharmaceuticalProduct {
  id: string;
  woreda?: string;
  facility: string;
  product_name: string;
  unit?: string;
  product_category?: string;
  price?: number;
  procurement_source?: string;
  quantity?: number;
  miazia_price?: number;
  created_at: string;
  updated_at: string;
}

export interface PharmaceuticalProductFilters {
  facility?: string;
  woreda?: string;
  product_category?: string;
  procurement_source?: string;
  search?: string;
}
