import watchImg from "@assets/stock_images/modern_smart_watch_p_f3b0dc4e.jpg";
import headphonesImg from "@assets/stock_images/wireless_headphones__77a1f1f0.jpg";
import shoesImg from "@assets/stock_images/running_shoes_produc_7d45a1d0.jpg";
import backpackImg from "@assets/stock_images/stylish_minimalist_b_b68eb963.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerTelegram: string; // username without @
}

export const products: Product[] = [];

export const categories = ["All", "Elektronika", "Kiyim-kechak", "Uy-ro'zg'or", "Go'zallik", "Aksessuarlar", "Bolalar uchun"];
