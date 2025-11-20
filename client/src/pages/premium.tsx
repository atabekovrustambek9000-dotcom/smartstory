import { ArrowLeft, Check, Crown, Star, Zap, CreditCard, X, ShieldCheck, Calendar, Lock } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // User Card State
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    holder: ""
  });

  const handleSubscribe = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      toast({
        title: "Muvaffaqiyatli to'landi!",
        description: "Pul 'Yangiyer Smart Store' hisobiga o'tkazildi.",
        duration: 3000,
      });
      // Reset form
      setCardDetails({ number: "", expiry: "", cvc: "", holder: "" });
    }, 2000);
  };

  // Simple formatter for card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails({ ...cardDetails, number: formatted });
  };

  // Simple formatter for expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    setCardDetails({ ...cardDetails, expiry: value });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-gray-900 text-white pb-10 pt-6 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-yellow-500 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-6 hover:bg-white/20 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-300 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-6 rotate-3">
              <Crown size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
            <p className="text-gray-300 text-sm max-w-[260px]">
              Unlock unlimited potential for your shop and reach more customers.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6">
        {/* Plan Switcher */}
        <div className="bg-white p-1.5 rounded-xl shadow-lg flex relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-900 rounded-lg transition-all duration-300 ${selectedPlan === 'monthly' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
          />
          <button 
            onClick={() => setSelectedPlan("monthly")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${selectedPlan === "monthly" ? "text-white" : "text-gray-500"}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setSelectedPlan("yearly")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${selectedPlan === "yearly" ? "text-white" : "text-gray-500"}`}
          >
            Yearly <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded ml-1">-20%</span>
          </button>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Unlimited Listings</h3>
              <p className="text-xs text-muted-foreground">Post as many products as you want without limits.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Featured Store</h3>
              <p className="text-xs text-muted-foreground">Get a "Verified" badge and appear at the top of searches.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Check size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">0% Commission</h3>
              <p className="text-xs text-muted-foreground">Keep 100% of your sales revenue. No hidden fees.</p>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="pt-4">
          <div className="flex flex-col items-center mb-6">
            <div className="text-3xl font-bold text-foreground">
              {selectedPlan === "monthly" ? "$9.99" : "$99.99"}
              <span className="text-sm text-muted-foreground font-normal">
                /{selectedPlan === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cancel anytime. Secure payment.</p>
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Subscribe Now
            <ArrowLeft className="rotate-180" size={20} />
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:top-[10%] bg-background rounded-3xl z-50 shadow-2xl border border-border max-w-md mx-auto overflow-hidden"
            >
              <div className="bg-primary/5 p-6 border-b border-border flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <CreditCard size={20} />
                    </div>
                    <span className="font-bold text-lg">Payment Details</span>
                 </div>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <X size={18} />
                 </button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground text-sm mb-1">Total to Pay</p>
                  <h2 className="text-4xl font-bold text-foreground">{selectedPlan === "monthly" ? "$9.99" : "$99.99"}</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input 
                        type="text" 
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Expiry</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input 
                          type="text" 
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input 
                          type="password" 
                          value={cardDetails.cvc}
                          onChange={(e) => {
                            if(e.target.value.length <= 3) setCardDetails({...cardDetails, cvc: e.target.value})
                          }}
                          placeholder="123"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Card Holder</label>
                    <input 
                      type="text" 
                      value={cardDetails.holder}
                      onChange={(e) => setCardDetails({...cardDetails, holder: e.target.value.toUpperCase()})}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none uppercase"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        Pay Securely
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                   <Lock size={12} />
                   <span>Payments are encrypted and secure</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
