import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'uz' | 'ru';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    home: "Bosh Sahifa",
    cart: "Savatcha",
    profile: "Profil",
    search_placeholder: "Mahsulotlarni qidirish...",
    add_to_cart: "Savatchaga qo'shish",
    added_to_cart: "Savatchaga qo'shildi",
    wishlist_empty: "Sevimlilar ro'yxati bo'sh",
    cart_empty: "Savatchangiz bo'sh",
    checkout: "Buyurtma berish",
    total: "Jami",
    my_orders: "Buyurtmalarim",
    notifications: "Bildirishnomalar",
    seller_mode: "Sotuvchi rejimi",
    settings: "Sozlamalar",
    log_out: "Chiqish",
    categories: {
      All: "Barchasi",
      Electronics: "Elektronika",
      Audio: "Audio",
      Footwear: "Oyoq kiyimlar",
      Accessories: "Aksessuarlar"
    }
  },
  ru: {
    home: "Главная",
    cart: "Корзина",
    profile: "Профиль",
    search_placeholder: "Поиск товаров...",
    add_to_cart: "Добавить в корзину",
    added_to_cart: "Добавлено в корзину",
    wishlist_empty: "Список желаний пуст",
    cart_empty: "Ваша корзина пуста",
    checkout: "Оформить заказ",
    total: "Итого",
    my_orders: "Мои заказы",
    notifications: "Уведомления",
    seller_mode: "Режим продавца",
    settings: "Настройки",
    log_out: "Выйти",
    categories: {
      All: "Все",
      Electronics: "Электроника",
      Audio: "Аудио",
      Footwear: "Обувь",
      Accessories: "Аксессуары"
    }
  }
};

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'uz',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        // Simple nested key retrieval (e.g. "categories.Electronics")
        const keys = key.split('.');
        let value: any = translations[lang];
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      }
    }),
    {
      name: 'language-storage',
    }
  )
);
