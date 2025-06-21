
export interface PharmaceuticalProduct {
  id: string;
  region?: string;
  zone?: string;
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
  region?: string;
  zone?: string;
  woreda?: string;
  product_category?: string;
  procurement_source?: string;
  search?: string;
}

export interface PharmaceuticalFilterLists {
  facilities: string[];
  regions: string[];
  zones: string[];
  woredas: string[];
}
