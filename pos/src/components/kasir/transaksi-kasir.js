import React, { useState, useEffect } from 'react';
import logoToko from '../logotoko.png';

// Sub-komponen Khusus untuk Animasi Angka Berhitung (Counting Up / Down)
function AnimatedCounter({ value, isCurrency = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = Number(value) || 0;
    const duration = 800; // Durasi animasi dalam milidetik

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing Function: Out-Expo agar pergerakan melambat secara mulus mendekati nilai akhir
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  if (isCurrency) {
    return <>Rp {displayValue.toLocaleString('id-ID')}</>;
  }

  return <>{displayValue}</>;
}

export default function RiwayatTransaksi({ transactions = [], onNavigateTerminal, onLogout }) {
  // State Modal Struk & Logout Confirm
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // State Data dari Database
  const [dbTransactions, setDbTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [cashierFilter, setCashierFilter] = useState('all');

  // State Paginasi (7 Item Per Halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // State User Aktif dari Login
  const [currentUser, setCurrentUser] = useState({
    name: 'Kasir Groseria',
    role: 'kasir',
    subtitle: 'Kasir'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('groseria_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user session', e);
      }
    }
    fetchTransactions();
  }, []);

  // Fetch Transaksi dari Backend API
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/transactions');
      if (res.ok) {
        const data = await res.json();
        setDbTransactions(data);
      }
    } catch (err) {
      console.error('Gagal mengambil data riwayat transaksi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayList = dbTransactions.length > 0 ? dbTransactions : transactions;

  // Daftar Kasir Unik untuk Dropdown Filter
  const uniqueCashiers = ['all', ...new Set(displayList.map((t) => t.userName || t.cashier).filter(Boolean))];

  // LOGIKA FILTER MULTI-KRITERIA
  const filteredList = displayList.filter((trx) => {
    // 1. Filter Pencarian Invoice
    const invNumber = (trx.invoiceNumber || trx.id || '').toLowerCase();
    const matchSearch = invNumber.includes(searchQuery.toLowerCase());

    // 2. Filter Rentang Tanggal
    let matchDate = true;
    if (trx.createdAt) {
      const trxDateStr = new Date(trx.createdAt).toISOString().split('T')[0];
      if (startDate && trxDateStr < startDate) matchDate = false;
      if (endDate && trxDateStr > endDate) matchDate = false;
    }

    // 3. Filter Metode Pembayaran
    let matchPayment = true;
    if (paymentFilter !== 'all') {
      matchPayment = (trx.paymentMethod || '').toLowerCase() === paymentFilter.toLowerCase();
    }

    // 4. Filter Kasir
    let matchCashier = true;
    if (cashierFilter !== 'all') {
      const cashierName = trx.userName || trx.cashier || '';
      matchCashier = cashierName.toLowerCase() === cashierFilter.toLowerCase();
    }

    return matchSearch && matchDate && matchPayment && matchCashier;
  });

  // PERHITUNGAN KPI TERFILTER (Dinamis Sesuai Hasil Filter)
  const totalNotaFilter = filteredList.length;
  const omzetTunaiFilter = filteredList
    .filter((t) => (t.paymentMethod || '').toLowerCase() === 'tunai' || (t.paymentMethod || '').toLowerCase() === 'cash')
    .reduce((acc, t) => acc + Number(t.totalAmount || t.grandTotal || 0), 0);
  const omzetQrisFilter = filteredList
    .filter((t) => (t.paymentMethod || '').toUpperCase() === 'QRIS')
    .reduce((acc, t) => acc + Number(t.totalAmount || t.grandTotal || 0), 0);

  // LOGIKA PAGINASI (7 Transaksi / Page)
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset Halaman ke 1 Jika Filter Berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, paymentFilter, cashierFilter]);

  // Handle Reset Semua Filter
  const handleResetFilter = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setPaymentFilter('all');
    setCashierFilter('all');
  };

  const handleOpenDetail = (trx) => {
    setSelectedTransaction(trx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased">
      
      {/* HEADER KASIR */}
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
              <button
                onClick={onNavigateTerminal}
                className="text-on-surface-variant hover:text-on-surface h-full flex items-center transition-colors cursor-pointer bg-transparent border-none font-medium text-sm"
                type="button"
              >
                Terminal Kasir
              </button>
              <a aria-current="page" className="h-full flex items-center text-primary font-title-sm border-b-2 border-primary transition-colors" href="#">
                Riwayat Transaksi
              </a>
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

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="ml-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-label-md flex items-center gap-1 transition-colors cursor-pointer"
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
      <main className="w-full pt-20 bg-background min-h-[calc(100vh-64px)] flex flex-col flex-1">
        <div className="max-w-7xl w-full mx-auto p-6 space-y-6 flex-1 flex flex-col">
          
          {/* Title & Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 bg-primary rounded-full inline-block"></span>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">Riwayat Transaksi</h1>
            </div>
            <button
              onClick={fetchTransactions}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-slate-200 hover:border-slate-300 hover:bg-surface-container-low text-on-surface text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-slate-500 text-[18px]">refresh</span>
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Metric KPI Cards (Dengan Animasi Hitung Naik / Turun) */}
          <section aria-label="Ringkasan Penjualan" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between transition-all">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Total Transaksi</span>
                <div className="text-2xl font-bold text-on-surface transition-all">
                  <AnimatedCounter value={totalNotaFilter} /> <span className="text-sm font-normal text-on-surface-variant ml-0.5">Nota</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between transition-all">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Omzet Tunai (Cash)</span>
                <div className="text-2xl font-bold text-on-surface transition-all">
                  <AnimatedCounter value={omzetTunaiFilter} isCurrency={true} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between transition-all">
              <div>
                <span className="text-xs font-medium text-on-surface-variant block mb-1">Omzet QRIS</span>
                <div className="text-2xl font-bold text-on-surface transition-all">
                  <AnimatedCounter value={omzetQrisFilter} isCurrency={true} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              </div>
            </div>
          </section>

          {/* Area Filter & Table */}
          <div className="bg-surface-container-lowest border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col">
            
          {/* Panel Toolbar Filter*/}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/40">
            
            {/* Input Pencarian */}
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID transaksi..."
                className="w-full pl-10 pr-4 py-2 font-body-sm text-body-sm bg-white border border-slate-200 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filter Dropdown & Tanggal */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 h-9 rounded-lg font-label-md text-label-md">
                <span className="text-on-surface-variant font-medium">Dari:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-on-surface cursor-pointer"
                />
                <span className="text-on-surface-variant font-medium ml-1">S/d:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-on-surface cursor-pointer"
                />
              </div>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none"
              >
                <option value="all">Semua Payment</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>

              <select
                value={cashierFilter}
                onChange={(e) => setCashierFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none"
              >
                <option value="all">Semua Kasir</option>
                {uniqueCashiers.filter((c) => c !== 'all').map((cashier, i) => (
                  <option key={i} value={cashier}>{cashier}</option>
                ))}
              </select>

              {(searchQuery || startDate || endDate || paymentFilter !== 'all' || cashierFilter !== 'all') && (
                <button
                  onClick={handleResetFilter}
                  className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-label-md text-label-md flex items-center gap-1 cursor-pointer transition-colors"
                  type="button"
                  title="Reset Filter"
                >
                  <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

            {/* Tabel Data Transaksi */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3.5 px-5">ID Transaksi</th>
                    <th className="py-3.5 px-5">Waktu</th>
                    <th className="py-3.5 px-5">Kasir</th>
                    <th className="py-3.5 px-5">Total Belanja</th>
                    <th className="py-3.5 px-5 text-center">Metode</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi / Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">Memuat data riwayat transaksi...</td>
                    </tr>
                  ) : paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">Transaksi tidak ditemukan.</td>
                    </tr>
                  ) : (
                    paginatedList.map((trx, idx) => {
                      const totalAmount = Number(trx.totalAmount || trx.grandTotal || 0);
                      const invId = trx.invoiceNumber || trx.id || `#TRX-${idx + 1}`;
                      const trxDate = trx.createdAt ? new Date(trx.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : (trx.date || '-');
                      const trxTime = trx.createdAt ? new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : (trx.time || '-');

                      return (
                        <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-4 px-5 font-bold font-mono text-on-surface whitespace-nowrap">{invId}</td>
                          <td className="py-4 px-5 whitespace-nowrap leading-snug">
                            <div className="font-semibold text-on-surface text-xs">{trxTime}</div>
                            <div className="text-[11px] text-on-surface-variant">{trxDate}</div>
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {(trx.userName || trx.cashier || currentUser.name || 'K').charAt(0)}
                              </div>
                              <span className="text-xs font-semibold text-on-surface">{trx.userName || trx.cashier || currentUser.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 font-bold text-on-surface whitespace-nowrap">
                            Rp {totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              {trx.paymentMethod || 'Tunai'}
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
                              className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest border border-slate-200 hover:border-slate-300 hover:bg-surface-container-low text-on-surface text-xs font-medium rounded-lg transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-slate-500 text-[16px]">info</span>
                              <span>Detail Struk</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER PAGINASI */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-surface-container-low/50 flex items-center justify-between gap-4 text-xs text-on-surface-variant">
              <div>
                Menampilkan <span className="font-bold text-on-surface">{filteredList.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredList.length)}</span> dari <span className="font-bold text-on-surface">{filteredList.length}</span> transaksi
              </div>

              {/* Navigasi Paginasi (< 1 >) */}
              <div className="flex items-center gap-2 font-medium">
                {filteredList.length > ITEMS_PER_PAGE && (
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded border border-slate-300 font-bold ${
                      currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200 cursor-pointer text-slate-800'
                    }`}
                    type="button"
                  >
                    &lt;
                  </button>
                )}

                <span className="px-3 py-1 bg-primary text-white font-bold rounded-md">
                  {currentPage}
                </span>

                {filteredList.length > ITEMS_PER_PAGE && (
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded border border-slate-300 font-bold ${
                      currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200 cursor-pointer text-slate-800'
                    }`}
                    type="button"
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* MODAL LOGOUT */}
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
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
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

      {/* MODAL DETAIL STRUK */}
      {isModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            <div className="px-6 py-3.5 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt</span>
                </div>
                <h3 className="font-title-sm text-on-surface font-bold">Detail Struk Transaksi</h3>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

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
                <div className="flex justify-between">
                  <span>No:</span>
                  <span className="font-semibold text-on-surface">{selectedTransaction.invoiceNumber || selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir: {selectedTransaction.userName || selectedTransaction.cashier || currentUser.name}</span>
                  <span>Metode: {selectedTransaction.paymentMethod || 'Tunai'}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-slate-400"></div>

              <div className="flex flex-col gap-2">
                {selectedTransaction.TransactionItems && selectedTransaction.TransactionItems.length > 0 ? (
                  selectedTransaction.TransactionItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.Product?.name || 'Produk'}</span>
                      <span className="font-semibold">Rp {(Number(item.priceAtTransaction) * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))
                ) : selectedTransaction.items ? (
                  selectedTransaction.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-semibold">Rp {(it.price * it.qty).toLocaleString('id-ID')}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 font-sans italic">Detail item tidak tersedia.</div>
                )}
              </div>

              <div className="border-b border-slate-300"></div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-bold text-sm text-primary pt-1">
                  <span>TOTAL:</span>
                  <span>Rp {Number(selectedTransaction.totalAmount || selectedTransaction.grandTotal || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-slate-400"></div>
              <div className="text-center text-on-surface-variant pt-1 font-sans text-[11px]">*** Terima Kasih Telah Berbelanja! 😊 ***</div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-slate-200 flex items-center justify-end gap-2">
              <button onClick={() => window.print()} className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-surface-container flex items-center gap-1.5 transition-colors text-xs font-semibold cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Struk</span>
              </button>
              <button onClick={handleCloseModal} className="h-10 px-4 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all text-xs cursor-pointer" type="button">
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}