import React, { useState } from 'react';

export default function RiwayatTransaksi({ transactions = [], onNavigateTerminal, onLogout }) {
  // State untuk modal detail struk
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk modal konfirmasi logout kustom
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handler eksekusi konfirmasi logout (dengan fallback aman)
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback darurat jika onLogout prop belum didefinisikan di parent
      window.location.reload(); 
    }
  };

  // Fungsi membuka detail struk
  const handleOpenDetail = (trx) => {
    setSelectedTransaction(trx);
    setIsModalOpen(true);
  };

  // Fungsi menutup detail struk
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Data dummy default jika props transactions kosong
  const defaultTransactions = [
    {
      id: 'TRX-20260915-001',
      date: '15 Sep 2026',
      time: '22:00 WIB',
      cashier: 'Valle',
      itemsSummary: 'Indomie (3), Aqua (1), Teh Botol (2)',
      totalQty: 6,
      grandTotal: 25725,
      subtotal: 24500,
      tax: 1225,
      paymentMethod: 'Cash (Tunai)',
      cashGiven: 30000,
      change: 4275,
      status: 'Sukses',
      items: [
        { name: 'Indomie Goreng', qty: 3, price: 3500, tax: 175, total: 10500 },
        { name: 'Aqua Botol 600ml', qty: 1, price: 4000, tax: 200, total: 4000 }
      ]
    },
    {
      id: 'TRX-20260915-002',
      date: '15 Sep 2026',
      time: '21:48 WIB',
      cashier: 'Dika',
      itemsSummary: 'Minyak Goreng Bimoli 1L (2), Beras 2.5kg (1)',
      totalQty: 3,
      grandTotal: 80000,
      subtotal: 76190,
      tax: 3810,
      paymentMethod: 'QRIS',
      cashGiven: 80000,
      change: 0,
      status: 'Sukses',
      items: [
        { name: 'Minyak Goreng Bimoli 1L', qty: 2, price: 25000, tax: 1250, total: 50000 },
        { name: 'Beras 2.5kg', qty: 1, price: 30000, tax: 1500, total: 30000 }
      ]
    }
  ];

  const displayList = transactions.length > 0 ? transactions : defaultTransactions;

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased">
      
      {/* HEADER KASIR (Konsisten dengan Dashboard Kasir) */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="h-16 w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>
              </div>
              <span className="font-title-md text-on-surface font-bold tracking-tight">POS Toko</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 h-16">
              <button 
                onClick={onNavigateTerminal} 
                className="text-on-surface-variant hover:text-on-surface h-full flex items-center transition-colors cursor-pointer bg-transparent border-none font-medium text-sm" 
                type="button"
              >
                Terminal Kasir
              </button>
              <a aria-current="page" className="h-full flex items-center text-primary font-title-sm border-b-2 border-primary transition-colors" href="#">Riwayat Transaksi</a>
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

        {/* Content Body */}
        <div className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1 flex flex-col">
          
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 bg-primary rounded-full inline-block"></span>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">Riwayat Transaksi</h1>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-slate-200 hover:border-slate-300 hover:bg-surface-container-low text-on-surface text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer" type="button">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">download</span>
              <span>Export Excel</span>
            </button>
          </div>

          {/* Metric KPI Cards Grid */}
          <section aria-label="Ringkasan Penjualan" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Transaksi Hari Ini</span>
                <div className="text-2xl font-bold text-on-surface">{displayList.length} <span className="text-sm font-normal text-on-surface-variant ml-0.5">Nota</span></div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Omzet Tunai (Cash)</span>
                <div className="text-2xl font-bold text-on-surface">Rp 1.850.000</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Omzet QRIS</span>
                <div className="text-2xl font-bold text-on-surface">Rp 1.625.000</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Omzet Debit</span>
                <div className="text-2xl font-bold text-on-surface">Rp 775.000</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">credit_card</span>
              </div>
            </div>
          </section>

          {/* Main Container: Filters & Table */}
          <div className="bg-surface-container-lowest border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-surface-container-lowest">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-slate-200 rounded-xl focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant text-on-surface transition-all font-mono" placeholder="Cari ID Transaksi..." type="text" />
                </div>
                
                <div className="flex items-center flex-wrap gap-2.5">
                  <select className="py-2 pl-3.5 pr-8 text-sm bg-surface-container-low border border-slate-200 rounded-xl text-on-surface font-medium focus:outline-none cursor-pointer">
                    <option>Hari Ini</option>
                    <option>Kemarin</option>
                    <option>7 Hari Terakhir</option>
                  </select>
                  <select className="py-2 pl-3.5 pr-8 text-sm bg-surface-container-low border border-slate-200 rounded-xl text-on-surface font-medium focus:outline-none cursor-pointer">
                    <option>Semua Kasir</option>
                    <option>Valle</option>
                    <option>Dika</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3.5 px-5">ID Transaksi</th>
                    <th className="py-3.5 px-5">Waktu</th>
                    <th className="py-3.5 px-5">Kasir</th>
                    <th className="py-3.5 px-5">Item / Jumlah</th>
                    <th className="py-3.5 px-5">Total Belanja</th>
                    <th className="py-3.5 px-5 text-center">Payment</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi / Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {displayList.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-5 font-bold font-mono text-on-surface whitespace-nowrap">{trx.id}</td>
                      <td className="py-4 px-5 whitespace-nowrap leading-snug">
                        <div className="font-semibold text-on-surface text-xs">{trx.time || '22:00 WIB'}</div>
                        <div className="text-[11px] text-on-surface-variant">{trx.date || '15 Sep 2026'}</div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {trx.cashier ? trx.cashier.charAt(0) : 'V'}
                          </div>
                          <span className="text-xs font-semibold text-on-surface">{trx.cashier || 'Valle'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <div className="truncate text-xs font-medium text-on-surface">
                          {trx.itemsSummary || (trx.items ? trx.items.map(i => `${i.name} (${i.qty})`).join(', ') : 'Produk Transaksi')}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">Total {trx.totalQty || 5} item</div>
                      </td>
                      <td className="py-4 px-5 font-bold text-on-surface whitespace-nowrap">
                        Rp {trx.grandTotal.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {trx.paymentMethod || 'Cash (Tunai)'}
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {trx.status || 'Sukses'}
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleOpenDetail(trx)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-slate-200 hover:border-slate-300 hover:bg-surface-container-low text-on-surface text-xs font-medium rounded-lg transition-colors shadow-2xs cursor-pointer" 
                          type="button"
                        >
                          <span className="material-symbols-outlined text-slate-500 text-[16px]">info</span>
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
              <div>Menampilkan <span className="font-bold text-on-surface">1 - {displayList.length}</span> dari <span className="font-bold text-on-surface">128</span> transaksi</div>
              <nav aria-label="Pagination" className="flex items-center space-x-1 font-medium">
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-slate-200 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" type="button">Sebelumnya</button>
                <button aria-current="page" className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-semibold rounded-lg shadow-2xs" type="button">1</button>
                <button className="px-3 py-1.5 bg-surface-container-lowest border border-slate-200 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" type="button">Berikutnya</button>
              </nav>
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

      {/* ================= MODAL DETAIL STRUK TRANSAKSI ================= */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            
            <div className="px-5 py-3.5 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-on-surface text-sm">Detail Struk Transaksi</span>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg p-1 transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 bg-surface-container-low/60 overflow-y-auto max-h-[75vh]">
              <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm font-mono text-xs text-on-surface">
                <div className="text-center mb-4">
                  <h2 className="font-bold text-base font-sans">POS TOKO</h2>
                  <p className="text-[11px] font-sans text-on-surface-variant">Jl. Contoh No. 123</p>
                </div>
                <div className="border-b-2 border-dashed border-slate-300 my-3"></div>
                
                <div className="space-y-1">
                  <div className="flex justify-between"><span>No</span> <span className="font-semibold">{selectedTransaction.id}</span></div>
                  <div className="flex justify-between"><span>Tgl</span> <span>{selectedTransaction.date} {selectedTransaction.time}</span></div>
                  <div className="flex justify-between"><span>Kasir</span> <span>{selectedTransaction.cashier}</span></div>
                </div>
                
                <div className="border-b-2 border-dashed border-slate-300 my-3"></div>
                
                <div className="space-y-3">
                  {selectedTransaction.items ? (
                    selectedTransaction.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between font-semibold">
                          <span>{item.name}</span> 
                          <span>Rp {item.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant text-[10px]">
                          <span>{item.qty} x Rp {item.price.toLocaleString()}</span> 
                          <span className="text-primary">Pjk: Rp {(item.tax * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="flex justify-between font-semibold"><span>{selectedTransaction.itemsSummary}</span> <span>Rp {selectedTransaction.grandTotal.toLocaleString()}</span></div>
                    </div>
                  )}
                </div>

                <div className="border-b border-slate-300 my-3"></div>
                <div className="flex justify-between text-sm font-bold py-1">
                  <span>TOTAL</span> <span className="text-primary">Rp {selectedTransaction.grandTotal.toLocaleString()}</span>
                </div>
                <div className="border-b-2 border-slate-800 my-3"></div>
                
                <div className="flex justify-between"><span>{selectedTransaction.paymentMethod}</span> <span>Rp {(selectedTransaction.cashGiven || selectedTransaction.grandTotal).toLocaleString()}</span></div>
                <div className="flex justify-between mt-1"><span>Kembalian</span> <span className="font-semibold">Rp {(selectedTransaction.change || 0).toLocaleString()}</span></div>
                
                <div className="text-center font-sans text-[11px] text-on-surface-variant mt-6">
                  <p>Terima kasih telah berbelanja! 😊</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-surface-container text-xs font-semibold transition-all cursor-pointer" type="button">
                Cetak Ulang
              </button>
              <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-all text-xs cursor-pointer" type="button">
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}