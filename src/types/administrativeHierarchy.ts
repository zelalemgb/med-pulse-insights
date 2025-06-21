
export interface Region {
  id: string;
  name: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  name: string;
  code?: string;
  region_id: string;
  created_at: string;
  updated_at: string;
  region?: Region;
}

export interface Woreda {
  id: string;
  name: string;
  code?: string;
  zone_id: string;
  created_at: string;
  updated_at: string;
  zone?: Zone;
}

export interface AdministrativeHierarchyFilters {
  region_id?: string;
  zone_id?: string;
  woreda_id?: string;
}
