import React, { useState, useEffect } from 'react';

export default function DashboardKasir({ onLogout, onSaveTransaction, onNavigateRiwayat }) {
  // State modal: 'none' | 'payment' | 'receipt'
  const [activeModal, setActiveModal] = useState('none');
  
  // State untuk modal konfirmasi logout kustom
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State metode pembayaran & uang diterima
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [cashGiven, setCashGiven] = useState(30000);
  
  // State keranjang belanja (AWAL KOSONG)
  const [cartItems, setCartItems] = useState([]);

  // Data master produk di sebelah kiri
  const productList = [
    { id: 1, name: 'Indomie Goreng', code: 'MKN-001', price: 3675, raw: 3500, tax: 175, stock: 'Stok 150', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbnHesYY6te6t_3lZGkwDk3W4p44GVor1W8KofRvsC5hCHPoa4ez5UKyocAYKEpZdeR5ssxp0LARPfrCysnrROmQO9YnfJhnetHEEeE4s5X-TZXaayOTKJaqDKdZdWvyLexFPf46Y3vC5MVTxQ9S_nRBU0Mh8ajsECcjArhAEUax3E09qJCYjoBqg3g87DhVy59TjLiijt6XDtEKCRA72R3ZkIBWffleZ7efEZ0hmzs9Os_Z07maw' },
    { id: 2, name: 'Aqua Botol 600ml', code: 'MNM-014', price: 4200, raw: 4000, tax: 200, stock: 'Sisa 7', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDicvEsRBhVIDZ9WMel0chLz3z2rF1_cNfEjDqyGNxP4Q8sY81cRi11h8o2Z5qbgJqy1bbg2czcOt_hmwDU2AYi9H1m_Suxr6sA6ldsxbnfaaFVIfJVL6PIniBpYSiIx3sfoU3xIJYJQYLVCijSILgmrhoehKbWup3dftrc17AqjCl2n0533aBY8TwjnqNWyvrvlWbKkSS-LHen9iX84Nz7Pa3lvKOmHlt1RO1gcVpqno6dbOp-sBg' },
    { id: 3, name: 'Teh Botol Sosro', code: 'MNM-008', price: 5250, raw: 5000, tax: 250, stock: 'Sisa 5', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIOCVREXJsznJXEdOeYYJ_WQw1vrJHGfAiGDEJnARW2ga7bZPYGmziB5ttr0YaEgtaVGRgKUfIX-4xPrDpy7HINCmN86iyHe6rza8nIv-YALjt09JJL3RjPjFGGRfbytJO7okiYaijV0F07Y0Q1RDKRABv3ZcMawCfJDIjHrCuZMh-arVxa_eDiiCyN3Mah8T1cVgWBECF1drIlbYNlS5_KHbJfqbBhFEl6H9Ht-fk3WSrKmxf2yg' },
  ];

  // Handler eksekusi konfirmasi logout
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Fungsi menambah produk ke keranjang
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  // Fungsi mengubah jumlah qty item di keranjang
  const handleUpdateQty = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Shortcut Keyboard [F2], [F9], [Escape], [Enter]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cartItems.length > 0) setActiveModal('payment');
      } else if (e.key === 'Escape') {
        setActiveModal('none');
        setShowLogoutConfirm(false);
      } else if (e.key === 'Enter' && activeModal === 'payment') {
        e.preventDefault();
        handleProcessPayment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, cashGiven, cartItems]);

  // Kalkulasi Total
  const subtotal = cartItems.reduce((acc, item) => acc + (item.raw * item.qty), 0);
  const totalTax = cartItems.reduce((acc, item) => acc + (item.tax * item.qty), 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const changeAmount = Math.max(0, cashGiven - grandTotal);

  // Proses pembayaran selesai & simpan ke riwayat (transaksi-kasir.js)
  const handleProcessPayment = () => {
    const newTransaction = {
      id: `#TRX-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      cashier: 'Valle',
      itemsSummary: cartItems.map(i => `${i.name} (${i.qty})`).join(', '),
      totalQty,
      items: cartItems,
      subtotal,
      tax: totalTax,
      grandTotal,
      paymentMethod,
      cashGiven,
      change: changeAmount,
      status: 'Sukses'
    };

    if (onSaveTransaction) {
      onSaveTransaction(newTransaction);
    }

    setActiveModal('receipt');
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased">
      
      {/* HEADER KASIR */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="h-16 w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                  <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-title-md text-on-surface font-bold tracking-tight">POS Toko</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 h-16">
              <a aria-current="page" className="h-full flex items-center text-primary font-title-sm border-b-2 border-primary transition-colors" href="#">Terminal Kasir</a>
              {/* Tombol navigasi ke transaksi-kasir.js */}
              <button 
                onClick={onNavigateRiwayat} 
                className="text-on-surface-variant hover:text-on-surface h-full flex items-center transition-colors cursor-pointer bg-transparent border-none font-medium text-sm" 
                type="button"
              >
                Riwayat Transaksi
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer" type="button">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="font-title-sm text-on-surface leading-tight">Valle</div>
                <div className="font-label-sm text-on-surface-variant">Kasir 01</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              
              {/* Tombol Logout memicu Modal Konfirmasi Kustom */}
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="ml-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-label-md flex items-center gap-1 transition-colors cursor-pointer" 
                title="Keluar dari sesi kasir"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-background min-h-[calc(100vh-64px)] flex flex-col flex-1">
        
        {/* Operational Bar */}
        <div className="w-full bg-surface-container-low px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
              <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
              <span className="text-on-surface-variant">Kasir Aktif:</span>
              <span className="font-title-sm text-on-surface">Valle</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg shadow-sm border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label-md">Mode Pajak: <strong>Tax-Inclusive 5% Aktif</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-sm text-xs border border-slate-200">F2 Cari</kbd>
            <kbd className="bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-sm text-xs border border-slate-200">F9 Bayar</kbd>
          </div>
        </div>

        {/* Dual Pane Workspace */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 flex-1 p-4 lg:p-6 gap-6">
          
          {/* LEFT PANEL: Catalog */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input id="search-input" className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary border border-slate-200" placeholder="Cari nama produk atau scan barcode..." type="text" />
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {productList.map((prod) => (
                <div 
                  key={prod.id} 
                  onClick={() => handleAddToCart(prod)}
                  className="group relative bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border border-slate-200"
                >
                  <div>
                    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-surface-container-low mb-2.5">
                      <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/95 text-secondary border border-slate-200 text-xs shadow-sm">{prod.stock}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mb-0.5">{prod.code}</div>
                    <h3 className="font-title-sm text-on-surface line-clamp-1 font-semibold">{prod.name}</h3>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="font-title-md text-on-surface font-bold">Rp {prod.price.toLocaleString()}</span>
                    <button className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors cursor-pointer" type="button">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: Cart & Summary */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
              <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </div>
                  <div>
                    <h2 className="font-title-md text-on-surface font-bold">Keranjang Transaksi</h2>
                    <div className="text-xs text-on-surface-variant">Order ID: <span className="font-semibold text-on-surface">#TRX-20260915-001</span></div>
                  </div>
                </div>
                <span className="bg-surface-container text-on-surface px-2.5 py-0.5 rounded-full text-xs font-semibold border border-slate-200">{totalQty} Item</span>
              </div>

              {/* Cart Items */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[320px] flex flex-col gap-3">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-surface-container-low border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-title-sm text-on-surface font-semibold truncate">{item.name}</span>
                        <span className="text-xs text-on-surface-variant">Rp {item.price.toLocaleString()} × {item.qty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                          <button onClick={() => handleUpdateQty(item.id, -1)} className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs" type="button">-</button>
                          <span className="px-2 text-xs font-semibold">{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.id, 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs" type="button">+</button>
                        </div>
                        <span className="font-bold text-on-surface text-sm">Rp {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-on-surface-variant flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2">remove_shopping_cart</span>
                    <p className="font-semibold text-slate-500">Keranjang masih kosong</p>
                    <p className="text-xs text-slate-400 mt-0.5">Silakan klik produk di sebelah kiri untuk menambahkan.</p>
                  </div>
                )}
              </div>

              {/* Bill Summary & Checkout Button */}
              <div className="p-4 bg-surface-container-lowest flex flex-col gap-2 border-t border-slate-200 shadow-inner">
                <div className="flex justify-between items-center text-on-surface-variant text-xs">
                  <span>Subtotal + Pajak (5%)</span>
                  <span className="font-title-sm text-on-surface">Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Grand Total Tagihan</span>
                  <span className="font-currency-display text-primary font-bold text-xl">Rp {grandTotal.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={() => cartItems.length > 0 && setActiveModal('payment')}
                  disabled={cartItems.length === 0}
                  className={`mt-2 w-full h-14 rounded-xl flex items-center justify-between px-6 shadow-md transition-all ${cartItems.length > 0 ? 'bg-primary hover:bg-primary-container text-on-primary active:scale-[0.99] cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[22px]">credit_card</span>
                    <div className="text-left font-bold tracking-tight text-sm">BAYAR SEKARANG [F9]</div>
                  </div>
                  <span className="font-title-lg font-bold text-base">Rp {grandTotal.toLocaleString()}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ================= MODAL KONFIRMASI LOGOUT KUSTOM ================= */}
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
              Apakah Anda benar-benar yakin ingin keluar dari sistem POS Toko? Anda harus memasukkan ulang kredensial untuk masuk kembali.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                type="button"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Ya, Keluar</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 1: KONFIRMASI PEMBAYARAN ================= */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
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
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Total Tagihan</span>
                <div className="bg-surface-container-low border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-primary font-bold text-2xl">Rp {grandTotal.toLocaleString()}</div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">Termasuk PPN 5%</div>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 font-semibold">Metode Pembayaran</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Tunai', 'QRIS', 'Debit'].map((method) => (
                    <div 
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`relative border p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${paymentMethod === method ? 'border-2 border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200 hover:bg-surface-container-low text-on-surface'}`}
                    >
                      {paymentMethod === method && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">✓</span>}
                      <span className="material-symbols-outlined text-[20px]">{method === 'Tunai' ? 'wallet' : method === 'QRIS' ? 'qr_code_2' : 'credit_card'}</span>
                      <span className="text-xs">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Tunai' && (
                <>
                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Uang Diterima</span>
                    <div className="border-2 border-primary rounded-xl px-4 py-2.5 bg-surface-container-lowest font-bold text-lg text-on-surface flex items-center justify-between shadow-sm">
                      <span className="text-primary text-base font-semibold">Rp</span>
                      <input 
                        type="number" 
                        value={cashGiven} 
                        onChange={(e) => setCashGiven(Number(e.target.value))}
                        className="w-full text-right bg-transparent focus:outline-none font-bold text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-on-surface-variant mb-1 font-medium">Pilihan Cepat Nominal</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[26000, 30000, 50000, 100000].map((nominal) => (
                        <button 
                          key={nominal} 
                          onClick={() => setCashGiven(nominal)}
                          className={`py-1 px-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${cashGiven === nominal ? 'bg-primary text-on-primary font-semibold border-primary' : 'border-slate-200 hover:bg-surface-container text-on-surface'}`}
                          type="button"
                        >
                          Rp {nominal.toLocaleString()}
                        </button>
                      ))}
                      <button 
                        onClick={() => setCashGiven(grandTotal)}
                        className="py-1 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer text-xs"
                        type="button"
                      >
                        Uang Pas
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-emerald-700 uppercase tracking-wider mb-1 font-semibold">Kembalian</span>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                      <span className="text-emerald-700 font-bold text-xl">Rp {changeAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button 
                  onClick={handleProcessPayment}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>PROSES PEMBAYARAN</span>
                </button>
                <p className="text-center text-on-surface-variant text-xs mt-1.5">Tekan Enter [↵] untuk selesaikan transaksi</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: STRUK / HASIL TRANSAKSI BERHASIL ================= */}
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
                  <span className="text-xs text-emerald-700 font-medium">Tersimpan ke Riwayat (transaksi-kasir.js)</span>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 bg-amber-50/40 font-mono text-on-surface flex flex-col gap-3 overflow-y-auto max-h-[60vh] shadow-inner text-xs">
              <div className="text-center flex flex-col items-center">
                <div className="font-bold text-base uppercase">POS TOKO MINIMARKET</div>
                <div className="text-on-surface-variant">Jl. Contoh No. 123, Jakarta</div>
              </div>
              <div className="border-b border-dashed border-slate-400"></div>
              
              <div className="flex flex-col gap-1 text-on-surface-variant">
                <div className="flex justify-between"><span>No:</span><span className="font-semibold text-on-surface">#TRX-20260915-001</span></div>
                <div className="flex justify-between"><span>Kasir: Valle</span><span>Metode: {paymentMethod}</span></div>
              </div>
              <div className="border-b border-dashed border-slate-400"></div>

              <div className="flex flex-col gap-2">
                {cartItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-semibold">Rp {(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-b border-slate-300"></div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>Rp {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Pajak (5%):</span><span>Rp {totalTax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span>Rp {grandTotal.toLocaleString()}</span>
                </div>
                {paymentMethod === 'Tunai' && (
                  <>
                    <div className="flex justify-between pt-1"><span>Tunai:</span><span>Rp {cashGiven.toLocaleString()}</span></div>
                    <div className="flex justify-between text-emerald-700 font-bold"><span>Kembalian:</span><span>Rp {changeAmount.toLocaleString()}</span></div>
                  </>
                )}
              </div>
              <div className="border-b border-dashed border-slate-400"></div>
              <div className="text-center text-on-surface-variant pt-1">*** Terima Kasih Telah Berbelanja! 😊 ***</div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-slate-200 flex items-center justify-between gap-2">
              <button onClick={() => window.print()} className="h-11 px-3 rounded-xl border border-slate-300 hover:bg-surface-container flex items-center gap-1.5 transition-colors text-xs cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Struk</span>
              </button>
              <button 
                onClick={() => { setActiveModal('none'); setCartItems([]); }} 
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