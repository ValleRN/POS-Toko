import React, { useState, useEffect } from 'react';
import logoToko from '../logotoko.png';

export default function DashboardKasir({ onLogout, onNavigateRiwayat }) {
  // State Modal: 'none' | 'payment' | 'receipt'
  const [activeModal, setActiveModal] = useState('none');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // State Shake Modal & Error Pembayaran
  const [isShakingModal, setIsShakingModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State ID Produk/Item Keranjang yang Sedang Bergetar
  const [shakingItemId, setShakingItemId] = useState(null);

  // State Toast Notification Pojok Kanan Bawah
  const [toast, setToast] = useState({ show: false, message: '' });

  // State Data Produk dari Database MySQL
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  // State Paginasi Katalog Produk (5 Produk / Halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 5;

  // State User Aktif dari Login
  const [currentUser, setCurrentUser] = useState({ name: 'Kasir Groseria', role: 'kasir', subtitle: 'Kasir' });

  // State Keranjang Belanja
  const [cartItems, setCartItems] = useState([]);

  // State Pengaturan Dinamis dari Backend (Pajak & Metode Pembayaran)
  const [taxRate, setTaxRate] = useState(0.05); // Default 5%
  const [taxPercentage, setTaxPercentage] = useState(5);
  const [activePaymentMethods, setActivePaymentMethods] = useState(['Tunai', 'QRIS']);

  // State Pembayaran
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [cashGiven, setCashGiven] = useState(0);

  // State Khusus QRIS
  const [qrisTimer, setQrisTimer] = useState(300); // 5 Menit = 300 detik
  const [qrisPaidStatus, setQrisPaidStatus] = useState(false);
  const [qrisTrxId, setQrisTrxId] = useState('');

  // Helper Notifikasi Toast Pojok Kanan Bawah
  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Helper Shake Item Katalog / Keranjang
  const triggerItemShake = (id) => {
    setShakingItemId(id);
    setTimeout(() => {
      setShakingItemId(null);
    }, 450);
  };

  // FETCH PENGATURAN TOKO (PAJAK) DARI BACKEND
  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/settings');
      if (res.ok) {
        const data = await res.json();
        
        // Persentase Pajak Dinamis
        const taxVal = Number(data.tax_percentage !== undefined ? data.tax_percentage : 5);
        setTaxPercentage(taxVal);
        setTaxRate(taxVal / 100);

        // Metode Pembayaran HANYA Tunai & QRIS
        const methods = [];
        if (data.payment_cash !== false) methods.push('Tunai');
        if (data.payment_qris !== false) methods.push('QRIS');
        
        if (methods.length === 0) methods.push('Tunai', 'QRIS');

        setActivePaymentMethods(methods);
        setPaymentMethod(methods[0]);
      }
    } catch (err) {
      console.error('Gagal mengambil pengaturan toko:', err);
    }
  };

  // Fetch Data Produk dari API Backend MySQL
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Gagal mengambil data produk:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('groseria_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user session', e);
      }
    }
    fetchSettings();
    fetchProducts();
  }, []);

  // Timer QRIS 5 Menit
  useEffect(() => {
    let interval = null;
    if (activeModal === 'payment' && paymentMethod === 'QRIS' && qrisTimer > 0 && !qrisPaidStatus) {
      interval = setInterval(() => {
        setQrisTimer((prev) => prev - 1);
      }, 1000);
    } else if (qrisTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeModal, paymentMethod, qrisTimer, qrisPaidStatus]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Kalkulasi Harga Kasir (Nett + Tax)
  const getCashierPrice = (nettPrice) => Math.round(Number(nettPrice || 0) * (1 + taxRate));

  const handleAddToCart = (prod) => {
    // 1. Jika Stok 0 / Habis
    if (prod.stock <= 0) {
      triggerItemShake(prod.id);
      triggerToast(`Stok barang '${prod.name}' habis!`);
      return;
    }

    const cashierPrice = getCashierPrice(prod.nettPrice);
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === prod.id);
      if (existing) {
        // 2. Jika penambahan melebihi stok
        if (existing.qty >= prod.stock) {
          triggerItemShake(prod.id);
          triggerToast(`Jumlah '${prod.name}' melebihi stok yang tersedia!`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: prod.id,
            code: prod.code,
            name: prod.name,
            nettPrice: prod.nettPrice,
            price: cashierPrice,
            qty: 1,
            unit: prod.unit,
            maxStock: prod.stock
          }
        ];
      }
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (newQty > item.maxStock) {
              triggerItemShake(`cart-${id}`);
              triggerToast(`Jumlah '${item.name}' melebihi stok yang tersedia!`);
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Kalkulasi Total dan Pajak
  const grandTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const subtotal = Math.round(grandTotal / (1 + taxRate));
  const totalTax = grandTotal - subtotal;
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  // Nilai Kembalian (Minus jika Uang Kurang)
  const rawChangeAmount = cashGiven - grandTotal;

  const handleOpenPaymentModal = () => {
    if (cartItems.length === 0) return;
    setCashGiven(grandTotal);
    if (activePaymentMethods.length > 0) {
      setPaymentMethod(activePaymentMethods[0]);
    }
    setQrisTimer(300);
    setQrisPaidStatus(false);
    setErrorMessage('');
    setQrisTrxId(`TRX-${Date.now().toString().slice(-8)}`);
    setActiveModal('payment');
  };

  // Efek Bergetar Smooth Modal Pembayaran
  const triggerModalShake = (msg) => {
    setErrorMessage(msg);
    setIsShakingModal(true);
    setTimeout(() => setIsShakingModal(false), 500);
  };

  const handleProcessPayment = async () => {
    // Validasi Uang Kurang (Khusus Tunai)
    if (paymentMethod === 'Tunai' && cashGiven < grandTotal) {
      triggerModalShake('Uang yang diterima kurang!');
      return;
    }

    // Validasi QRIS Belum Lunas
    if (paymentMethod === 'QRIS' && !qrisPaidStatus) {
      triggerModalShake('Pembayaran QRIS belum dikonfirmasi/lunas!');
      return;
    }

    const transactionPayload = {
      invoiceNumber: qrisTrxId,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod,
      userId: currentUser.id || 1,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.qty,
        priceAtTransaction: item.price
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        triggerModalShake(`Gagal memproses: ${errData.message || 'Kesalahan server'}`);
        return;
      }

      fetchProducts(); // Refresh stok dari database secara otomatis
      setActiveModal('receipt');
    } catch (error) {
      console.error('Error transaksi:', error);
      triggerModalShake('Terjadi kesalahan koneksi ke server backend.');
    }
  };

  const categories = ['Semua', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // LOGIKA PAGINASI KATALOG (5 PRODUK PER HALAMAN)
  const totalProductPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const startProdIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startProdIndex, startProdIndex + PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased relative">
      
      {/* CSS Keyframe Animasi Shake Smooth Kanan-Kiri */}
      <style>{`
        @keyframes shakeSmooth {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px); }
          30%, 60%, 90% { transform: translateX(8px); }
        }
        .animate-shake-smooth {
          animation: shakeSmooth 0.45s ease-in-out;
        }
      `}</style>

      {/* HEADER KASIR GROSERIA */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="h-16 w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                <img src={logoToko} alt="Logo Groseria" className="w-full h-full object-contain" />
              </div>
              <span className="font-title-md text-on-surface font-bold tracking-tight text-lg">Groseria</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 h-16">
              <a aria-current="page" className="h-full flex items-center text-primary font-title-sm border-b-2 border-primary transition-colors" href="#">
                Terminal Kasir
              </a>
              <button onClick={onNavigateRiwayat} className="text-on-surface-variant hover:text-on-surface h-full flex items-center transition-colors cursor-pointer bg-transparent border-none font-medium text-sm" type="button">
                Riwayat Transaksi
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="font-title-sm text-on-surface leading-tight font-semibold">{currentUser.name || 'Kasir Groseria'}</div>
                <div className="font-label-sm text-on-surface-variant text-xs">{currentUser.subtitle || 'Kasir'}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>

              <button onClick={() => setShowLogoutConfirm(true)} className="ml-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-label-md flex items-center gap-1 transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT TERMINAL KASIR */}
      <main className="w-full pt-20 bg-background min-h-[calc(100vh-64px)] flex flex-col flex-1">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 flex-1 p-4 lg:p-6 gap-6">
          
          {/* PANEL KIRI: KATALOG PRODUK */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama produk atau kode.."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary border border-slate-200 text-sm"
                />
              </div>

              {/* Filter Kategori */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 px-3 bg-surface-container-low border border-slate-200 rounded-lg text-xs font-semibold text-on-surface focus:outline-none cursor-pointer w-full sm:w-auto"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat === 'Semua' ? 'Semua Kategori' : cat}</option>
                ))}
              </select>
            </div>

            {/* LIST PRODUK KATALOG */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col justify-between">
              <div className="p-3.5 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Memuat daftar produk dari database...</div>
                ) : paginatedProducts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Produk tidak ditemukan.</div>
                ) : (
                  paginatedProducts.map((prod) => {
                    const cashierPrice = getCashierPrice(prod.nettPrice);

                    // ATURAN STATUS RENTANG STOK
                    const isHabis = prod.stock === 0;
                    const isCritical = prod.stock > 0 && prod.stock <= 3;
                    const isMenipis = prod.stock > 3 && prod.stock <= 10;
                    const isAman = prod.stock > 10;

                    const isShaking = shakingItemId === prod.id;

                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleAddToCart(prod)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer group ${
                          isShaking ? 'animate-shake-smooth border-rose-500 bg-rose-50/20' : 'border-blue-100/80 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {/* KIRI: Kode, Judul & Info Status */}
                        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono font-bold text-[10px]">
                              {prod.code}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors truncate">
                            {prod.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-[11px]">
                              <span className="material-symbols-outlined text-[14px] text-slate-400">sell</span>
                              <span>SKU: {prod.sku || prod.code}</span>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-medium">
                              <span className="material-symbols-outlined text-[14px] text-slate-400">category</span>
                              <span>{prod.category || 'Umum'}</span>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] font-medium">
                              <span className="material-symbols-outlined text-[14px] text-slate-400">inventory_2</span>
                              <span>stok {prod.stock} {prod.unit || 'pcs'}</span>
                            </div>

                            {/* BADGE INDIKATOR STATUS STOK */}
                            {isHabis && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-100 text-slate-500 border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                <span>Habis</span>
                              </div>
                            )}

                            {isCritical && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-rose-50 text-rose-600 border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                <span>kritis</span>
                              </div>
                            )}

                            {isMenipis && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>menipis</span>
                              </div>
                            )}

                            {isAman && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-600 border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>aman</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* KANAN: Harga Kasir & Tombol Add */}
                        <div className="flex items-center gap-3 shrink-0 border-l border-slate-100 pl-4">
                          <div className="text-right">
                            <div className="font-extrabold text-blue-600 text-xl tracking-tight">
                              Rp {cashierPrice.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Harga Kasir</div>
                          </div>

                          <button
                            type="button"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm group-hover:scale-105 active:scale-95 cursor-pointer ${
                              isHabis 
                                ? 'bg-slate-200 text-slate-400 hover:bg-slate-300' 
                                : 'bg-blue-600 text-white group-hover:bg-blue-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px]">add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER PAGINASI PRODUK (Maks 5 produk/halaman + Input Angka) */}
              <div className="p-3 bg-surface-container-low/50 border-t border-slate-200 flex items-center justify-between text-xs text-on-surface-variant">
                <div>
                  Menampilkan <span className="font-bold text-on-surface">{filteredProducts.length > 0 ? startProdIndex + 1 : 0} - {Math.min(startProdIndex + PRODUCTS_PER_PAGE, filteredProducts.length)}</span> dari <span className="font-bold text-on-surface">{filteredProducts.length}</span> produk
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
                    type="button"
                  >
                    &lt;
                  </button>

                  <div className="flex items-center gap-1">
                    <span>Hal</span>
                    <input
                      type="number"
                      min="1"
                      max={totalProductPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Number(e.target.value);
                        if (page >= 1 && page <= totalProductPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="w-12 h-7 text-center font-bold bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                    />
                    <span>dari {totalProductPages}</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalProductPages, p + 1))}
                    disabled={currentPage === totalProductPages}
                    className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
                    type="button"
                  >
                    &gt;
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* PANEL KANAN: KERANJANG BELANJA & TOTAL */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
              
              <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-on-surface font-bold">Keranjang Transaksi</h2>
                    <div className="text-xs text-on-surface-variant">
                      Order ID: <span className="font-semibold text-on-surface">#{qrisTrxId || 'TRX-NEW'}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-surface-container text-on-surface px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200">
                  {totalQty} Item
                </span>
              </div>

              {/* Daftar Item Keranjang */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[350px] flex flex-col gap-2.5">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const isCartShaking = shakingItemId === `cart-${item.id}`;
                    return (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                          isCartShaking ? 'animate-shake-smooth border-rose-500 bg-rose-50/30' : 'bg-surface-container-low border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-title-sm text-on-surface font-semibold truncate">{item.name}</span>
                          <span className="text-xs text-on-surface-variant">Rp {item.price.toLocaleString('id-ID')} × {item.qty}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                            <button onClick={() => handleUpdateQty(item.id, -1)} className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer text-xs" type="button">-</button>
                            <span className="px-2 text-xs font-semibold">{item.qty}</span>
                            <button onClick={() => handleUpdateQty(item.id, 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer text-xs" type="button">+</button>
                          </div>
                          <span className="font-bold text-on-surface text-sm w-20 text-right">
                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-on-surface-variant flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2">remove_shopping_cart</span>
                    <p className="font-semibold text-slate-500">Keranjang masih kosong</p>
                    <p className="text-xs text-slate-400 mt-0.5">Klik produk pada daftar di sebelah kiri untuk menambahkan.</p>
                  </div>
                )}
              </div>

              {/* Ringkasan Subtotal, Pajak & Tombol Bayar */}
              <div className="p-4 bg-surface-container-lowest flex flex-col gap-2 border-t border-slate-200">
                <div className="flex justify-between items-center text-on-surface-variant text-xs">
                  <span>Subtotal + PPN ({taxPercentage}%)</span>
                  <span className="font-title-sm text-on-surface">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Grand Total Tagihan</span>
                  <span className="font-currency-display text-primary font-bold text-xl">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  onClick={handleOpenPaymentModal}
                  disabled={cartItems.length === 0}
                  className={`mt-2 w-full h-14 rounded-xl flex items-center justify-between px-6 shadow-md transition-all ${
                    cartItems.length > 0
                      ? 'bg-primary hover:bg-primary-container text-on-primary cursor-pointer active:scale-[0.99]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px]">payments</span>
                    <div className="text-left font-bold tracking-tight text-sm">BAYAR SEKARANG</div>
                  </div>
                  <span className="font-title-lg font-bold text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* TOAST NOTIFICATION POJOK KANAN BAWAH */}
      <div
        className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl bg-rose-600 text-white flex items-center gap-3 transition-all duration-300 border border-rose-500 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">error</span>
        <div className="flex flex-col">
          <span className="font-bold text-xs">Peringatan Stok</span>
          <span className="text-xs opacity-90">{toast.message}</span>
        </div>
      </div>

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                <span className="material-symbols-outlined text-[26px]">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Konfirmasi Keluar</h3>
                <p className="text-xs text-slate-400">Sesi aktif kasir akan diakhiri.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Apakah Anda benar-benar yakin ingin keluar dari sistem Groseria?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer" type="button">
                Batal
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); if (onLogout) onLogout(); }} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5" type="button">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PEMBAYARAN (TUNAI & QRIS) */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 transition-all ${
            isShakingModal ? 'animate-shake-smooth border-red-500' : ''
          }`}>
            
            <div className="px-6 py-3.5 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <h3 className="font-title-md text-on-surface font-bold">Konfirmasi Pembayaran</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 bg-surface-container-lowest">
              
              {/* Notifikasi Error Peringatan */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Total Tagihan</span>
                <div className="bg-surface-container-low border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-primary font-bold text-2xl">Rp {grandTotal.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">Termasuk PPN {taxPercentage}%</div>
                </div>
              </div>

              {/* OPSI METODE PEMBAYARAN: TUNAI & QRIS */}
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 font-semibold">Metode Pembayaran</span>
                <div className="grid grid-cols-2 gap-3">
                  {activePaymentMethods.map((method) => (
                    <div
                      key={method}
                      onClick={() => { setPaymentMethod(method); setErrorMessage(''); }}
                      className={`relative border p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'border-2 border-primary bg-primary/10 text-primary font-bold'
                          : 'border-slate-200 hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {method === 'Tunai' ? 'wallet' : 'qr_code_2'}
                      </span>
                      <span className="text-sm">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TAMPILAN TUNAI */}
              {paymentMethod === 'Tunai' && (
                <>
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Uang Diterima</span>
                    <div className="border-2 border-primary rounded-xl px-4 py-2 bg-surface-container-lowest font-bold text-lg text-on-surface flex items-center justify-between shadow-sm">
                      <span className="text-primary text-base font-semibold">Rp</span>
                      <input
                        type="number"
                        value={cashGiven}
                        onChange={(e) => {
                          setCashGiven(Number(e.target.value));
                          setErrorMessage('');
                        }}
                        className="w-full text-right bg-transparent focus:outline-none font-bold text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant mb-1 font-medium">Pilihan Cepat Nominal</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[10000, 20000, 50000, 100000].map((nominal) => (
                        <button
                          key={nominal}
                          onClick={() => { setCashGiven(nominal); setErrorMessage(''); }}
                          className={`py-1 px-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            cashGiven === nominal ? 'bg-primary text-on-primary font-semibold border-primary' : 'border-slate-200 hover:bg-surface-container text-on-surface'
                          }`}
                          type="button"
                        >
                          Rp {nominal.toLocaleString('id-ID')}
                        </button>
                      ))}
                      <button
                        onClick={() => { setCashGiven(grandTotal); setErrorMessage(''); }}
                        className="py-1 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer text-xs"
                        type="button"
                      >
                        Uang Pas
                      </button>
                    </div>
                  </div>

                  {/* KEMBALIAN (BERWARNA MERAH BILA MINUS) */}
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase tracking-wider mb-1 font-semibold ${rawChangeAmount < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      Kembalian
                    </span>
                    <div className={`border rounded-xl p-3 text-center ${
                      rawChangeAmount < 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      <span className="font-bold text-xl">
                        {rawChangeAmount < 0 ? `-Rp ${Math.abs(rawChangeAmount).toLocaleString('id-ID')}` : `Rp ${rawChangeAmount.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* TAMPILAN QRIS SIMULASI */}
              {paymentMethod === 'QRIS' && (
                <div className="flex flex-col items-center justify-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Kedaluwarsa dalam: <strong>{formatTimer(qrisTimer)}</strong></span>
                  </div>

                  <div className="relative p-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        `http://192.168.1.11:3000/pay?trx=${qrisTrxId}&total=${grandTotal}`
                      )}`}
                      alt="QRIS Barcode"
                      className="w-40 h-40 object-contain"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 font-mono">{qrisTrxId}</span>
                  </div>

                  {qrisPaidStatus ? (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      <span>Pembayaran QRIS Berhasil (LUNAS)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        onClick={() => { setQrisPaidStatus(true); setErrorMessage(''); }}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Konfirmasi Lunas (Simulasi HP)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tombol Eksekusi Bayar */}
              <div className="pt-2">
                <button
                  onClick={handleProcessPayment}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>PROSES PEMBAYARAN</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STRUK TRANSAKSI GROSERIA (BSD CITY) */}
      {activeModal === 'receipt' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            <div className="px-6 py-3.5 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-on-surface font-bold">Transaksi Berhasil</h3>
                  <span className="text-xs text-emerald-700 font-medium">Stok database otomatis terpotong</span>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Template Struk Nota GROSERIA */}
            <div className="p-6 bg-amber-50/30 font-mono text-on-surface flex flex-col gap-3 overflow-y-auto max-h-[60vh] text-xs">
              <div className="text-center flex flex-col items-center">
                <div className="w-10 h-10 mb-1 overflow-hidden">
                  <img src={logoToko} alt="Groseria" className="w-full h-full object-contain" />
                </div>
                <div className="font-bold text-base uppercase tracking-wider font-sans">GROSERIA</div>
                <div className="text-on-surface-variant font-sans text-[11px]">BSD City, Tangerang Selatan</div>
              </div>

              <div className="border-b border-dashed border-slate-400"></div>

              <div className="flex flex-col gap-1 text-on-surface-variant">
                <div className="flex justify-between"><span>No:</span><span className="font-semibold text-on-surface">#{qrisTrxId}</span></div>
                <div className="flex justify-between"><span>Kasir: {currentUser.name || 'Kasir Groseria'}</span><span>Metode: {paymentMethod}</span></div>
              </div>

              <div className="border-b border-dashed border-slate-400"></div>

              <div className="flex flex-col gap-2">
                {cartItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-semibold">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-slate-300"></div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Pajak ({taxPercentage}%):</span><span>Rp {totalTax.toLocaleString('id-ID')}</span></div>
                
                <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between pt-1"><span>Bayar ({paymentMethod}):</span><span>Rp {(paymentMethod === 'Tunai' ? cashGiven : grandTotal).toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-emerald-700 font-bold"><span>Kembalian:</span><span>Rp {(paymentMethod === 'Tunai' ? rawChangeAmount : 0).toLocaleString('id-ID')}</span></div>
              </div>

              <div className="border-b border-dashed border-slate-400"></div>
              <div className="text-center text-on-surface-variant pt-1 font-sans text-[11px]">*** Terima Kasih Telah Berbelanja! 😊 ***</div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-slate-200 flex items-center justify-between gap-2">
              <button onClick={() => window.print()} className="h-11 px-3 rounded-xl border border-slate-300 hover:bg-surface-container flex items-center gap-1.5 transition-colors text-xs cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Struk</span>
              </button>
              <button
                onClick={() => {
                  setActiveModal('none');
                  setCartItems([]);
                }}
                className="flex-1 h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all text-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Transaksi Baru</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}