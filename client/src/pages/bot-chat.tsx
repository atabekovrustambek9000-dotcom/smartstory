import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, User, MoreVertical, Paperclip, Smile } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function BotChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Assalomu alaykum! Yangiyer Smart Store botiga xush kelibsiz. Sizga qanday yordam bera olaman?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botText = "Uzr, men hozircha faqat test rejimida ishlayapman.";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes("salom") || lowerInput.includes("qalay")) {
        botText = "Vaalaykum assalom! Yaxshimisiz?";
      } else if (lowerInput.includes("narx") || lowerInput.includes("qancha")) {
        botText = "Mahsulotlar narxini ilovamizning bosh sahifasida ko'rishingiz mumkin.";
      } else if (lowerInput.includes("premium")) {
        botText = "Premium obuna orqali siz cheksiz e'lonlar joylashtira olasiz. Profil bo'limiga o'tib batafsil bilib oling.";
      } else if (lowerInput.includes("buyurtma") || lowerInput.includes("zakaz")) {
        botText = "Buyurtmalaringiz holatini 'Buyurtmalarim' bo'limida kuzatishingiz mumkin.";
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        text: botText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#8c9caf] bg-opacity-20">
      {/* Chat Header */}
      <header className="bg-primary text-primary-foreground p-3 flex items-center gap-3 shadow-md z-10">
        <Link href="/profile">
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
        </Link>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-sm">Yangiyer Bot</h1>
          <p className="text-xs text-blue-100">bot</p>
        </div>
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={22} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#72879d]/10" style={{ backgroundImage: "url('https://web.telegram.org/img/bg_0.png')", backgroundSize: 'cover' }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm relative shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#efffde] text-black rounded-tr-none' 
                  : 'bg-white text-black rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] float-right mt-1 ml-2 ${msg.sender === 'user' ? 'text-green-800' : 'text-gray-400'}`}>
                {msg.time}
                {msg.sender === 'user' && <span className="ml-1">✓✓</span>}
              </span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-background p-2 border-t border-border flex items-end gap-2">
        <button className="p-3 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
          <Paperclip size={24} />
        </button>
        <form onSubmit={handleSend} className="flex-1 bg-secondary/50 rounded-2xl flex items-center px-4 py-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Xabar yozish..."
            className="flex-1 bg-transparent border-none outline-none py-3 text-sm"
          />
          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
            <Smile size={24} />
          </button>
        </form>
        {input.trim() ? (
          <button 
            onClick={() => handleSend()}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        ) : (
          <button className="p-3 bg-primary/80 text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md">
             {/* Microphone icon would go here usually, but keeping it simple */}
             <Bot size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
