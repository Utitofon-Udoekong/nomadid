import { create } from 'zustand';
import { SearchResultItem } from '../api/d3Api';

interface CartStore {
  items: SearchResultItem[];
  addItem: (item: SearchResultItem) => void;
  removeItem: (sld: string, tld: string) => void;
  clearCart: () => void;
  isInCart: (sld: string, tld: string) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const isAlreadyInCart = get().isInCart(item.sld, item.tld);
    if (!isAlreadyInCart) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (sld, tld) => {
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.sld === sld && item.tld === tld)
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  isInCart: (sld, tld) => {
    return get().items.some((item) => item.sld === sld && item.tld === tld);
  },
})); 