import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Telegram Web App
const initTelegram = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Set colors to match theme
    tg.setHeaderColor('#ffffff'); // Matches light mode background
    
    // Enable closing confirmation if needed
    tg.enableClosingConfirmation();
  }
};

// Add type declaration for window.Telegram
declare global {
  interface Window {
    Telegram: any;
  }
}

initTelegram();

createRoot(document.getElementById("root")!).render(<App />);
