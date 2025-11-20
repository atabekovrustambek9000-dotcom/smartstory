import { create } from 'zustand';
import { Product } from './data';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  toggleWishlist: (product) => {
    const items = get().items;
    const exists = items.find((item) => item.id === product.id);

    if (exists) {
      set({ items: items.filter((item) => item.id !== product.id) });
    } else {
      set({ items: [...items, product] });
    }
  },
  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },
}));
