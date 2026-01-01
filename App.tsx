
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewState, UserAccount, Product, RecyclableItem, Transaction, Reward } from './types';
import { REWARD_CATALOG } from './constants';
import { identifyRecyclable, generateProductImage } from './services/geminiService';

const INITIAL_VENDING_PRODUCTS: Product[] = [
  // Drinks - PET Bottels
  { id: 'p3', name: 'Maaza Mango', description: 'Indulgent alphonso mango fruit drink in 250ml PET.', priceCoins: 5, priceCash: 20, category: 'Drink', image: 'https://images.unsplash.com/photo-1546173159-315724a9d86a?w=400&h=400&fit=crop', savings: 15 },
  { id: 'p5', name: 'Bisleri Water', description: 'Pure and safe drinking water in 500ml PET.', priceCoins: 5, priceCash: 10, category: 'Drink', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop', savings: 5 },
  { id: 'p10', name: 'Sprite PET (250ml)', description: 'Chilled lime-lemon soft drink in a small PET bottle.', priceCoins: 12, priceCash: 35, category: 'Drink', image: 'GENERATE', savings: 20 },
  { id: 'p11', name: 'Thums Up PET (250ml)', description: 'Strong, fizzy cola with a spicy bite in a small PET bottle.', priceCoins: 12, priceCash: 35, category: 'Drink', image: 'GENERATE', savings: 20 },
  { id: 'p12', name: '7Up PET (250ml)', description: 'Refreshing lemon-lime PET drink.', priceCoins: 10, priceCash: 30, category: 'Drink', image: 'GENERATE', savings: 15 },
  { id: 'p13', name: 'Fanta Orange (250ml)', description: 'Small orange PET bottle drink.', priceCoins: 12, priceCash: 35, category: 'Drink', image: 'GENERATE', savings: 20 },
  { id: 'p14', name: 'Sting Energy (250ml)', description: 'Electrifying red energy drink in a sleek PET bottle.', priceCoins: 15, priceCash: 25, category: 'Drink', image: 'GENERATE', savings: 10 },
  { id: 'p15', name: 'Pepsi PET (250ml)', description: 'Classic Pepsi cola in a small, chilled PET bottle.', priceCoins: 12, priceCash: 35, category: 'Drink', image: 'GENERATE', savings: 20 },
  { id: 'p16', name: 'Mountain Dew PET (250ml)', description: 'Do the Dew with this citrus blast in a small PET bottle.', priceCoins: 12, priceCash: 35, category: 'Drink', image: 'GENERATE', savings: 20 },
  { id: 'p17', name: 'Mirinda PET (250ml)', description: 'Sweet and tangy orange soda in a small PET bottle.', priceCoins: 10, priceCash: 30, category: 'Drink', image: 'GENERATE', savings: 15 },
  
  // Snacks - Chocolates & More
  { id: 'p1', name: 'Roasted Cashews', description: 'Premium roasted and salted cashews.', priceCoins: 20, priceCash: 60, category: 'Snack', image: 'https://images.unsplash.com/photo-1509912747193-453000969634?w=400&h=400&fit=crop', savings: 40 },
  { id: 'p2', name: 'Bourbon Biscuits', description: 'Classic chocolate cream sandwich biscuits.', priceCoins: 10, priceCash: 30, category: 'Snack', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', savings: 20 },
  { id: 'p4', name: 'Coca-Cola (Can)', description: 'Refreshing classic cola taste.', priceCoins: 15, priceCash: 40, category: 'Drink', image: 'https://images.unsplash.com/photo-1622708782419-610811197a8a?w=400&h=400&fit=crop', savings: 25 },
  { id: 'p18', name: 'Dairy Milk Silk', description: 'Smooth, creamy, and indulgent milk chocolate bar.', priceCoins: 25, priceCash: 80, category: 'Snack', image: 'GENERATE', savings: 50 },
  { id: 'p19', name: 'KitKat 4-Finger', description: 'Crisp wafer fingers covered in smooth milk chocolate.', priceCoins: 15, priceCash: 45, category: 'Snack', image: 'GENERATE', savings: 25 },
  { id: 'p20', name: 'Munch Crisp', description: 'Delicious wafer bar with a light chocolate coating.', priceCoins: 5, priceCash: 10, category: 'Snack', image: 'GENERATE', savings: 5 },
  { id: 'p21', name: '5 Star Bar', description: 'Chewy caramel and nougat covered in milk chocolate.', priceCoins: 10, priceCash: 25, category: 'Snack', image: 'GENERATE', savings: 10 },
  { id: 'p22', name: 'Ferrero Rocher (3-pack)', description: 'Whole hazelnut in milk chocolate and nut croquante.', priceCoins: 50, priceCash: 150, category: 'Snack', image: 'GENERATE', savings: 80 },
];

const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ScanIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ShopIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const CatalogIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const VoucherIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const HistoryIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const CoinsIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <div className={`flex items-center justify-center bg-yellow-400 rounded-full transition-transform duration-300 ${className}`} style={{ width: size, height: size }}>
    <span className="text-yellow-900 font-bold leading-none" style={{ fontSize: size * 0.6 }}>₹</span>
  </div>
);

const ProductImage = ({ product, onQuotaExhausted }: { product: Product, onQuotaExhausted: () => void }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(product.image === 'GENERATE' ? null : product.image);
  const [loading, setLoading] = useState(product.image === 'GENERATE');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    if (product.image === 'GENERATE' && !imgSrc && !errorStatus) {
      const cached = localStorage.getItem(`ai_img_${product.id}`);
      if (cached) {
        setImgSrc(cached);
        setLoading(false);
        return;
      }

      const fetchImg = async () => {
        setLoading(true);
        const generated = await generateProductImage(product.name, product.description);
        if (generated === 'QUOTA_EXHAUSTED') {
          setErrorStatus('QUOTA');
          onQuotaExhausted();
        } else if (generated) {
          setImgSrc(generated);
          localStorage.setItem(`ai_img_${product.id}`, generated);
        } else {
          setErrorStatus('ERROR');
        }
        setLoading(false);
      };
      fetchImg();
    }
  }, [product, imgSrc, errorStatus]);

  if (loading) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse text-center px-4">AI Rendering...</span>
      </div>
    );
  }

  if (errorStatus === 'QUOTA') {
    return (
      <div className="w-full h-full bg-orange-50 flex flex-col items-center justify-center p-4 text-center">
        <svg className="w-8 h-8 text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest leading-tight">AI Service Limit Reached</span>
        <img src={`https://via.placeholder.com/400?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-16 h-16 object-contain opacity-20 grayscale absolute" />
      </div>
    );
  }

  return (
    <img src={imgSrc || `https://via.placeholder.com/400?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('landing_choice');
  const [pendingDestination, setPendingDestination] = useState<ViewState>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Drink' | 'Snack'>('All');
  const [rewardFilter, setRewardFilter] = useState<'ALL' | 'FOOD' | 'SHOPPING' | 'MALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [notif, setNotif] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [appliedCoins, setAppliedCoins] = useState(0);
  const [quotaHit, setQuotaHit] = useState(false);

  const [isAnimatingBalance, setIsAnimatingBalance] = useState(false);
  const [balanceDelta, setBalanceDelta] = useState<{ value: number; type: 'gain' | 'loss' } | null>(null);
  const [cartBump, setCartBump] = useState(false);
  const [floatingFeedback, setFloatingFeedback] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const lastBalanceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem('ecovend_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.transactions = (parsed.transactions || []).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
      setCurrentUser(parsed);
      lastBalanceRef.current = parsed.balance;
    } else {
      const initialUser: UserAccount = { 
        username: 'eco.hero@ecovend.ai', 
        balance: 350, 
        totalRecycled: 12, 
        transactions: [{ id: 'init-1', type: 'recycle', amount: 50, description: 'New Profile Setup', timestamp: new Date() }] 
      };
      setCurrentUser(initialUser);
      lastBalanceRef.current = initialUser.balance;
      localStorage.setItem('ecovend_user', JSON.stringify(initialUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser && lastBalanceRef.current !== undefined && currentUser.balance !== lastBalanceRef.current) {
      const diff = currentUser.balance - lastBalanceRef.current;
      setIsAnimatingBalance(true);
      setBalanceDelta({ value: Math.abs(diff), type: diff > 0 ? 'gain' : 'loss' });
      const timer = setTimeout(() => setIsAnimatingBalance(false), 800);
      const deltaTimer = setTimeout(() => setBalanceDelta(null), 1500);
      lastBalanceRef.current = currentUser.balance;
      return () => { clearTimeout(timer); clearTimeout(deltaTimer); };
    }
  }, [currentUser?.balance]);

  const totalCartAmount = useMemo(() => {
    let total = 0;
    cart.forEach((qty, id) => {
      const product = INITIAL_VENDING_PRODUCTS.find(p => p.id === id);
      if (product) total += product.priceCash * qty;
    });
    return total;
  }, [cart]);

  const cartTotalQty = useMemo(() => Array.from(cart.values()).reduce((a, b) => a + b, 0), [cart]);

  useEffect(() => {
    if (cartTotalQty > 0) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartTotalQty]);

  const maxPossibleDiscountValue = useMemo(() => {
    let total = 0;
    cart.forEach((qty, id) => {
      const product = INITIAL_VENDING_PRODUCTS.find(p => p.id === id);
      if (product) total += (product.savings || 0) * qty;
    });
    return total;
  }, [cart]);

  const maxPossibleCoinsToUse = useMemo(() => {
    let total = 0;
    cart.forEach((qty, id) => {
      const product = INITIAL_VENDING_PRODUCTS.find(p => p.id === id);
      if (product) total += (product.priceCoins || 0) * qty;
    });
    return total;
  }, [cart]);

  useEffect(() => {
    const limit = Math.min(currentUser?.balance || 0, maxPossibleCoinsToUse);
    if (appliedCoins > limit) setAppliedCoins(limit);
  }, [maxPossibleCoinsToUse, currentUser?.balance, appliedCoins]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleAuthorizeKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setQuotaHit(false);
      showNotification("AI Core Authorized", "success");
    }
  };

  const handleRecycle = (item: RecyclableItem) => {
    if (!currentUser) return;
    const newTx: Transaction = { id: Math.random().toString(36).substr(2, 9), type: 'recycle', amount: item.reward, description: `Recycled ${item.name}`, timestamp: new Date() };
    const updated = { ...currentUser, balance: currentUser.balance + item.reward, totalRecycled: currentUser.totalRecycled + 1, transactions: [newTx, ...(currentUser.transactions || [])] };
    setCurrentUser(updated);
    localStorage.setItem('ecovend_user', JSON.stringify(updated));
    showNotification(`Earned ₹${item.reward} Eco-Coins!`);
    setView('landing_choice');
  };

  const updateCartQty = (productId: string, delta: number, event?: React.MouseEvent) => {
    setCart(prev => {
      const next = new Map(prev);
      const current = next.get(productId) || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal <= 0) next.delete(productId);
      else next.set(productId, newVal);
      return next;
    });

    if (event && delta > 0) {
      const feedbackId = Math.random().toString(36).substr(2, 9);
      const feedback = { id: feedbackId, text: '+1', x: event.clientX, y: event.clientY };
      setFloatingFeedback(prev => [...prev, feedback]);
      setTimeout(() => setFloatingFeedback(prev => prev.filter(f => f.id !== feedbackId)), 1000);
    }
  };

  const handleConfirmPayment = () => {
    if (!currentUser) return;
    const coinValueUsed = appliedCoins;
    const discountAmount = maxPossibleCoinsToUse > 0 ? Math.floor((appliedCoins / maxPossibleCoinsToUse) * maxPossibleDiscountValue) : 0;
    const finalPrice = totalCartAmount - discountAmount;
    const newTx: Transaction = { id: Math.random().toString(36).substr(2, 9), type: 'purchase', amount: -coinValueUsed, description: `Vending Purchase: Paid ₹${finalPrice.toFixed(0)}`, timestamp: new Date() };
    const updated = { ...currentUser, balance: currentUser.balance - coinValueUsed, transactions: [newTx, ...(currentUser.transactions || [])] };
    setCurrentUser(updated);
    localStorage.setItem('ecovend_user', JSON.stringify(updated));
    setCart(new Map());
    setAppliedCoins(0);
    showNotification("Dispensing products...");
    setView('dispensing');
  };

  const handleRedeemReward = (reward: Reward) => {
    if (!currentUser) return;
    if (currentUser.balance < reward.coinPrice) { showNotification("Insufficient balance.", "error"); return; }
    const newTx: Transaction = { id: Math.random().toString(36).substr(2, 9), type: 'transfer', amount: -reward.coinPrice, description: `Redeemed ${reward.name}`, timestamp: new Date() };
    const updated = { ...currentUser, balance: currentUser.balance - reward.coinPrice, transactions: [newTx, ...(currentUser.transactions || [])] };
    setCurrentUser(updated);
    localStorage.setItem('ecovend_user', JSON.stringify(updated));
    showNotification(`${reward.name} voucher added!`);
    setView('vouchers');
  };

  const handleStartChoice = (dest: ViewState) => { setPendingDestination(dest); setView('auth_choice'); };
  const completeAuth = () => { showNotification("Identify Success!", "success"); setView(pendingDestination); };

  if (view === 'landing_choice') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden font-inter select-none">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-600/20 blur-[120px] rounded-full" />
        <header className="relative z-20 p-8 flex justify-center items-center w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl shadow-2xl">
              <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
            </div>
            <div className="text-white font-black text-3xl leading-none tracking-tight uppercase italic mt-4">ECOVEND <span className="text-green-500">AI</span></div>
            <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase">Autonomous Recycling Terminal</p>
          </div>
        </header>
        <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full p-4 lg:p-12 gap-6">
          <section onClick={() => handleStartChoice('store')} className="flex-1 flex flex-col items-center justify-center p-12 text-center group cursor-pointer transition-all duration-700 bg-[#0A101F]/40 border border-white/5 rounded-[4rem] hover:bg-blue-600/10 hover:border-blue-500/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="mb-14 relative z-10">
              <div className="w-40 h-40 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-110 group-hover:border-blue-500 transition-all duration-700">
                <svg className="w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </div>
            </div>
            <div className="space-y-4 relative z-10"><h2 className="text-7xl lg:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-white">SHOP IN<br/><span className="text-blue-600">VENDING</span></h2></div>
          </section>
          <section onClick={() => handleStartChoice('scan')} className="flex-1 flex flex-col items-center justify-center p-12 text-center group cursor-pointer transition-all duration-700 bg-[#0A101F]/40 border border-white/5 rounded-[4rem] hover:bg-green-600/10 hover:border-green-500/30 overflow