
import { ProductData, ImportSummary } from '@/types/pharmaceutical';
import { secureSet, secureGet, secureRemove } from './secureStorage';
import { serialize, deserialize } from './serialization';

const STORAGE_KEYS = {
  PRODUCTS: 'pharmaceutical_products',
  IMPORT_HISTORY: 'import_history',
  USER_PREFERENCES: 'user_preferences'
};

export const saveProductsToStorage = async (products: ProductData[]): Promise<void> => {
  try {
    await secureSet(STORAGE_KEYS.PRODUCTS, serialize(products));
    console.log(`Saved ${products.length} products to storage`);
  } catch (error) {
    console.error('Failed to save products to storage:', error);
    throw new Error('Failed to save data to storage');
  }
};

export const loadProductsFromStorage = async (): Promise<ProductData[]> => {
  try {
    const stored = await secureGet<string>(STORAGE_KEYS.PRODUCTS);
    if (!stored) return [];

    const products = deserialize<ProductData[]>(stored);
    return products;
  } catch (error) {
    console.error('Failed to load products from storage:', error);
    return [];
  }
};

export const addProductsToStorage = async (newProducts: ProductData[]): Promise<ProductData[]> => {
  const existing = await loadProductsFromStorage();
  const combined = [...existing, ...newProducts];
  await saveProductsToStorage(combined);
  return combined;
};

export const saveImportSummary = async (summary: ImportSummary): Promise<void> => {
  try {
    const existing = await getImportHistory();
    const updated = [summary, ...existing].slice(0, 50); // Keep last 50 imports
    await secureSet(STORAGE_KEYS.IMPORT_HISTORY, serialize(updated));
  } catch (error) {
    console.error('Failed to save import summary:', error);
  }
};

export const getImportHistory = async (): Promise<ImportSummary[]> => {
  try {
    const stored = await secureGet<string>(STORAGE_KEYS.IMPORT_HISTORY);
    if (!stored) return [];

    return deserialize<ImportSummary[]>(stored);
  } catch (error) {
    console.error('Failed to load import history:', error);
    return [];
  }
};

export const clearAllData = async (): Promise<void> => {
  await Promise.all(Object.values(STORAGE_KEYS).map(key => secureRemove(key)));
};

export const getStorageStats = async () => {
  const products = await loadProductsFromStorage();
  const importHistory = await getImportHistory();

  return {
    totalProducts: products.length,
    lastImport: importHistory[0]?.timestamp,
    totalImports: importHistory.length,
    storageSize: new Blob([JSON.stringify(products)]).size
  };
};
