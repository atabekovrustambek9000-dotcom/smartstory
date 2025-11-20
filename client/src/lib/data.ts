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

export const products: Product[] = [
  {
    id: 1,
    name: "Apex Smart Watch",
    price: 299,
    category: "Electronics",
    image: watchImg,
    description: "Monitor your health and stay connected with the Apex Smart Watch. Features an always-on Retina display, ECG app, and fall detection.",
    sellerName: "Tech Haven",
    sellerPhone: "+998 90 123 45 67",
    sellerTelegram: "tech_haven_admin"
  },
  {
    id: 2,
    name: "Sonic Pro Headphones",
    price: 199,
    category: "Audio",
    image: headphonesImg,
    description: "Immerse yourself in pure sound with Sonic Pro. Active noise cancellation, 30-hour battery life, and premium comfort for long listening sessions.",
    sellerName: "Audio World",
    sellerPhone: "+998 93 987 65 43",
    sellerTelegram: "audio_world_support"
  },
  {
    id: 3,
    name: "Velocity Runner",
    price: 120,
    category: "Footwear",
    image: shoesImg,
    description: "Built for speed and comfort. The Velocity Runner features responsive cushioning and a breathable mesh upper for your best run yet.",
    sellerName: "Sport Style",
    sellerPhone: "+998 99 111 22 33",
    sellerTelegram: "sport_style_shop"
  },
  {
    id: 4,
    name: "Urban Commuter Pack",
    price: 85,
    category: "Accessories",
    image: backpackImg,
    description: "Sleek, durable, and water-resistant. The Urban Commuter Pack has a dedicated laptop sleeve and plenty of space for your daily essentials.",
    sellerName: "Urban Gear",
    sellerPhone: "+998 97 555 44 22",
    sellerTelegram: "urban_gear_manager"
  }
];

export const categories = ["All", "Electronics", "Audio", "Footwear", "Accessories"];
