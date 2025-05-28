
import { ProductData, ImportSummary } from '@/types/pharmaceutical';

const STORAGE_KEYS = {
  PRODUCTS: 'pharmaceutical_products',
  IMPORT_HISTORY: 'import_history',
  USER_PREFERENCES: 'user_preferences'
};

export const saveProductsToStorage = (products: ProductData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log(`Saved ${products.length} products to storage`);
  } catch (error) {
    console.error('Failed to save products to storage:', error);
    throw new Error('Failed to save data to local storage');
  }
};

export const loadProductsFromStorage = (): ProductData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!stored) return [];
    
    const products = JSON.parse(stored);
    return products.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to load products from storage:', error);
    return [];
  }
};

export const addProductsToStorage = (newProducts: ProductData[]): ProductData[] => {
  const existing = loadProductsFromStorage();
  const combined = [...existing, ...newProducts];
  saveProductsToStorage(combined);
  return combined;
};

export const saveImportSummary = (summary: ImportSummary): void => {
  try {
    const existing = getImportHistory();
    const updated = [summary, ...existing].slice(0, 50); // Keep last 50 imports
    localStorage.setItem(STORAGE_KEYS.IMPORT_HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save import summary:', error);
  }
};

export const getImportHistory = (): ImportSummary[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.IMPORT_HISTORY);
    if (!stored) return [];
    
    return JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load import history:', error);
    return [];
  }
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const getStorageStats = () => {
  const products = loadProductsFromStorage();
  const importHistory = getImportHistory();
  
  return {
    totalProducts: products.length,
    lastImport: importHistory[0]?.timestamp,
    totalImports: importHistory.length,
    storageSize: new Blob([JSON.stringify(products)]).size
  };
};
