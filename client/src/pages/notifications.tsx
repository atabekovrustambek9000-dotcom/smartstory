import { ArrowLeft, Bell, ShoppingBag, Tag, Info } from "lucide-react";
import { Link } from "wouter";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Order Shipped!",
      message: "Your order #ORD-7781 has been shipped and is on its way.",
      time: "2 hours ago",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Flash Sale Alert",
      message: "Get 50% off on all electronics for the next 24 hours!",
      time: "5 hours ago",
      icon: Tag,
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 3,
      title: "System Update",
      message: "We've updated our privacy policy. Tap to read more.",
      time: "1 day ago",
      icon: Info,
      color: "bg-gray-100 text-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
        <Link href="/">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-bold">Notifications</h1>
      </header>

      <div className="p-4 space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm hover:bg-secondary/30 transition-colors cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
              <notif.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm">{notif.title}</h3>
                <span className="text-[10px] text-muted-foreground">{notif.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
