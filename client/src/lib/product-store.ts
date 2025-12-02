import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      
      addProduct: (product) => set((state) => ({ 
        products: [product, ...state.products] 
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }))
    }),
    {
      name: 'product-storage',
    }
  )
);
