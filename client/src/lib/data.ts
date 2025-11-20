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
    name: "Apple Watch Ultra 2",
    price: 850,
    category: "Electronics",
    image: watchImg,
    description: "Original Apple Watch Ultra 2. Yangi karobka. 1 yil kafolat. Barcha ranglari mavjud.",
    sellerName: "Malika Shop",
    sellerPhone: "+998 90 123 45 67",
    sellerTelegram: "malika_shop_admin"
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    price: 350,
    category: "Audio",
    image: headphonesImg,
    description: "Eng zo'r shovqin so'ndiruvchi quloqchinlar. Batareya 30 soatga yetadi. Qora va oq ranglari bor.",
    sellerName: "Audio Market",
    sellerPhone: "+998 93 987 65 43",
    sellerTelegram: "audio_market_uz"
  },
  {
    id: 3,
    name: "Nike ZoomX Vaporfly",
    price: 220,
    category: "Footwear",
    image: shoesImg,
    description: "Original Nike yugurish oyoq kiyimlari. Juda yengil va qulay. Razmerlar: 39-44.",
    sellerName: "Sport Mix",
    sellerPhone: "+998 99 111 22 33",
    sellerTelegram: "sport_mix_manager"
  },
  {
    id: 4,
    name: "Shahar Ryukzaki (Anti-theft)",
    price: 45,
    category: "Accessories",
    image: backpackImg,
    description: "Suv o'tkazmaydigan, USB portli va o'g'rilikka qarshi himoyalangan ryukzak. Noutbuk uchun maxsus joyi bor.",
    sellerName: "Sumkalar Olami",
    sellerPhone: "+998 97 555 44 22",
    sellerTelegram: "bag_shop_uz"
  }
];

export const categories = ["All", "Electronics", "Audio", "Footwear", "Accessories"];
