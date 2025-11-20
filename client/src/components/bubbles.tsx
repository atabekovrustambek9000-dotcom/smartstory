import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Bubbles() {
  const [bubbles, setBubbles] = useState<{
    id: number;
    size: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    color: string;
  }[]>([]);

  useEffect(() => {
    // Increased opacity from /10 to /30 for better visibility
    const colors = ["bg-blue-400/30", "bg-purple-400/30", "bg-pink-400/30", "bg-green-400/30", "bg-yellow-400/30"];
    
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 100 + 50, // 50px - 150px
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-900 dark:to-gray-800/50" />

      {/* Large Ambient Blobs - Increased opacity slightly */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-[120px] animate-float" />
      <div className="absolute top-[30%] -left-32 w-80 h-80 bg-purple-400/30 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[130px] animate-float-fast" />

      {/* Small Scattered Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          // Increased border opacity and backdrop blur
          className={`absolute rounded-full ${bubble.color} backdrop-blur-[4px] border border-white/20 shadow-lg`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5], // Increased opacity range
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}
    </div>
  );
}
