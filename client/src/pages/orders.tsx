import { ArrowLeft, Package, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Orders() {
  const orders = [
    {
      id: "#ORD-7782",
      date: "Today, 10:23 AM",
      status: "Processing",
      total: 299.00,
      items: ["Apex Smart Watch"],
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      id: "#ORD-7781",
      date: "Yesterday",
      status: "Delivered",
      total: 85.00,
      items: ["Urban Commuter Pack"],
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      id: "#ORD-7745",
      date: "Nov 15, 2025",
      status: "Cancelled",
      total: 199.00,
      items: ["Sonic Pro Headphones"],
      color: "text-red-500",
      bg: "bg-red-50"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-4">
        <Link href="/profile">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-bold">My Orders</h1>
      </header>

      <div className="p-4 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.bg} ${order.color}`}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{order.id}</h3>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${order.bg} ${order.color}`}>
                {order.status}
              </span>
            </div>
            
            <div className="border-t border-border/50 my-3"></div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {order.items.join(", ")}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">${order.total}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
