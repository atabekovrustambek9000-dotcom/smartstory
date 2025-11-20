import { motion } from "framer-motion";

export default function Bubbles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Right - Yellow/Orange */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-[80px] animate-float" />
      
      {/* Bottom Left - Blue/Purple */}
      <div className="absolute top-[20%] -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[90px] animate-float-slow" />
      
      {/* Bottom Right - Pink */}
      <div className="absolute bottom-20 -right-10 w-64 h-64 bg-pink-400/20 rounded-full blur-[70px] animate-float-fast" />
      
      {/* Center - Green */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-5s' }} />
    </div>
  );
}
