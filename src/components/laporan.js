import React, { useState } from 'react';

export default function LaporanPage() {
  // State untuk filter periode aktif ('today', 'week', 'month', 'custom')
  const [activePeriod, setActivePeriod] = useState('today');

  // State untuk modal export Excel
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // State untuk modal preview struk
  const [receiptData, setReceiptData] = useState(null);

  // Handler tombol export
  const handleOpenExport = () => {
    setIsExportModalOpen(true);
    setDownloadSuccess(false);
  };

  const handleCloseExport = () => {
    setIsExportModalOpen(false);
    setIsDownloading(false);
    setDownloadSuccess(false);
  };

  const handleConfirmDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        handleCloseExport();
      }, 1000);
    }, 1200);
  };

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6 pb-12">
        
        {/* Top Breadcrumb & Page Actions Bar (Disamakan persis dengan Page Transaksi) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                <span>Admin</span>
              </a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-medium">Laporan</span>
            </nav>

            {/* Title with Subtle Accent Bar */}
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-primary"></div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Laporan Penjualan
              </h1>
            </div>
          </div>
          
          {/* Period Filter Pills & Export CTA */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-surface-container-low p-1 rounded-lg flex items-center gap-1 shadow-sm">
              <button 
                onClick={() => setActivePeriod('today')}
                className={`filter-pill px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${activePeriod === 'today' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`} 
                type="button"
              >
                Hari Ini
              </button>
              <button 
                onClick={() => setActivePeriod('week')}
                className={`filter-pill px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${activePeriod === 'week' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`} 
                type="button"
              >
                Minggu Ini
              </button>
              <button 
                onClick={() => setActivePeriod('month')}
                className={`filter-pill px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${activePeriod === 'month' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`} 
                type="button"
              >
                Bulan Ini
              </button>
              <button 
                onClick={() => setActivePeriod('custom')}
                className={`filter-pill px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all cursor-pointer ${activePeriod === 'custom' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`} 
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>01/09/2026 - 15/09/2026</span>
              </button>
            </div>

            {/* Export Action Trigger */}
            <button 
              onClick={handleOpenExport}
              className="h-10 px-4 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer" 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Total Penjualan */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-slate-200">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 bg-primary/5 rounded-full pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Penjualan</span>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-currency-display text-currency-display text-on-surface tracking-tight">Rp 12.500.000</div>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-semibold border border-emerald-100">
                <span className="material-symbols-outlined text-[15px]">trending_up</span>
                <span>+15.2%</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">vs periode lalu</span>
            </div>
          </div>

          {/* Card 2: Jumlah Transaksi */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-slate-200">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 bg-secondary-container/20 rounded-full pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Jumlah Transaksi</span>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="font-currency-display text-currency-display text-on-surface tracking-tight">87</div>
                <span className="font-title-md text-title-md text-on-surface-variant">Nota Kasir</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-semibold border border-emerald-100">
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                <span>+12 transaksi</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">rata-rata 11 trx/jam</span>
            </div>
          </div>

          {/* Card 3: Rata-Rata Keranjang */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-slate-200">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-28 h-28 bg-surface-container-high/40 rounded-full pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Rata-Rata Keranjang</span>
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[22px]">shopping_basket</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-currency-display text-currency-display text-on-surface tracking-tight">Rp 143.678</div>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="font-label-sm text-label-sm text-on-surface bg-surface-container-low px-2 py-0.5 rounded-md font-medium">Nilai per Transaksi</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Tertinggi: Rp 820.000</span>
            </div>
          </div>

        </div>

        {/* Grafik Penjualan Harian Section */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">query_stats</span>
                <h2 className="font-title-lg text-title-lg text-on-surface">Grafik Penjualan Harian</h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Tren omzet harian 7 hari terakhir (9 - 15 September 2026)</span>
            </div>
            
            <div className="flex items-center gap-4 font-label-sm text-label-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                <span>Omzet Penjualan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-outline-variant inline-block border-dashed border-t border-secondary"></span>
                <span>Target (Rp 1.500.000)</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-surface-container-low/50 rounded-xl p-4 relative border border-slate-200">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[640px] h-64 relative flex flex-col justify-between">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm opacity-50">
                    <span>Rp 2.500.000</span>
                    <div className="flex-1 ml-3 border-b border-surface-variant"></div>
                  </div>
                  <div className="w-full flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm opacity-50">
                    <span>Rp 2.000.000</span>
                    <div className="flex-1 ml-3 border-b border-surface-variant"></div>
                  </div>
                  <div className="w-full flex items-center justify-between text-secondary font-label-sm text-label-sm">
                    <span className="font-semibold text-primary">Rp 1.500.000</span>
                    <div className="flex-1 ml-3 border-b-2 border-dashed border-primary/40"></div>
                  </div>
                  <div className="w-full flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm opacity-50">
                    <span>Rp 1.000.000</span>
                    <div className="flex-1 ml-3 border-b border-surface-variant"></div>
                  </div>
                  <div className="w-full flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm opacity-50">
                    <span>Rp 0</span>
                    <div className="flex-1 ml-3 border-b border-surface-variant"></div>
                  </div>
                </div>

                <div className="absolute left-24 right-4 bottom-7 top-4 flex items-end justify-around gap-4 z-10">
                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">09 Sep: Rp 1.400.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '56%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">1.4M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">09 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">10 Sep: Rp 1.600.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '64%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">1.6M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">10 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">11 Sep: Rp 1.900.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '76%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">1.9M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">11 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">12 Sep: Rp 1.500.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '60%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">1.5M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">12 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">13 Sep: Rp 2.100.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '84%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">2.1M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">13 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">14 Sep: Rp 1.800.000</div>
                    <div className="w-full bg-surface-container-highest group-hover:bg-primary-container rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2" style={{ height: '72%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant group-hover:text-on-primary">1.8M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-medium">14 Sep</span>
                  </div>

                  <div className="group flex flex-col items-center h-full justify-end flex-1 max-w-[56px] relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-label-sm font-label-sm py-1 px-2 rounded shadow-md whitespace-nowrap pointer-events-none z-20">Hari Ini: Rp 2.200.000 (Tertinggi)</div>
                    <div className="w-full bg-primary rounded-t-lg transition-all duration-300 relative flex items-end justify-center pb-2 shadow-sm" style={{ height: '88%' }}>
                      <span className="font-label-sm text-label-sm font-semibold text-on-primary">2.2M</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold mt-2">15 Sep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Rincian Transaksi Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200">
          <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 bg-surface-container-low/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">list_alt</span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface">Rincian Transaksi Penjualan</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Log data transaksi terverifikasi masuk ke sistem buku kas</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">search</span>
                <input className="w-56 h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Cari No. Trx / Kasir..." type="text" />
              </div>
              <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                <option value="all">Semua Kasir</option>
                <option value="Valle">Valle (Kasir)</option>
                <option value="Budi">Budi (Kasir)</option>
              </select>
              <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                <option value="all">Semua Status</option>
                <option value="selesai">Selesai</option>
              </select>
              <button className="w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer" title="Segarkan Data" type="button">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm min-w-[900px]">
              <thead className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center w-12">No</th>
                  <th className="py-3 px-4">Tanggal &amp; Waktu</th>
                  <th className="py-3 px-4">No. Trx</th>
                  <th className="py-3 px-4">Kasir</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-on-surface">
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium text-on-surface-variant">1</td>
                  <td className="py-3.5 px-4 font-medium">15/09/2026 21:45</td>
                  <td className="py-3.5 px-4"><span className="font-title-sm text-title-sm text-primary tracking-tight">TRX-001</span></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold flex items-center justify-center">V</span>
                      <span>Valle (Kasir)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">qr_code_2</span> QRIS
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-title-sm text-title-sm text-on-surface">Rp 24.500</td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => setReceiptData({ no: 'TRX-001', time: '15/09/2026 21:45', cashier: 'Valle', method: 'QRIS', total: 'Rp 24.500' })}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-medium transition-all inline-flex items-center gap-1 cursor-pointer" 
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      <span>Lihat Struk</span>
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium text-on-surface-variant">2</td>
                  <td className="py-3.5 px-4 font-medium">15/09/2026 21:30</td>
                  <td className="py-3.5 px-4"><span className="font-title-sm text-title-sm text-primary tracking-tight">TRX-002</span></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold flex items-center justify-center">V</span>
                      <span>Valle (Kasir)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-semibold inline-flex items-center gap-1 border border-emerald-100">
                      <span className="material-symbols-outlined text-[14px]">payments</span> Tunai
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-title-sm text-title-sm text-on-surface">Rp 18.000</td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => setReceiptData({ no: 'TRX-002', time: '15/09/2026 21:30', cashier: 'Valle', method: 'Tunai', total: 'Rp 18.000' })}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-medium transition-all inline-flex items-center gap-1 cursor-pointer" 
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      <span>Lihat Struk</span>
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium text-on-surface-variant">3</td>
                  <td className="py-3.5 px-4 font-medium">15/09/2026 20:15</td>
                  <td className="py-3.5 px-4"><span className="font-title-sm text-title-sm text-primary tracking-tight">TRX-003</span></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">B</span>
                      <span>Budi (Kasir)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">credit_card</span> Debit BCA
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-title-sm text-title-sm text-on-surface">Rp 145.000</td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => setReceiptData({ no: 'TRX-003', time: '15/09/2026 20:15', cashier: 'Budi', method: 'Debit BCA', total: 'Rp 145.000' })}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm font-medium transition-all inline-flex items-center gap-1 cursor-pointer" 
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      <span>Lihat Struk</span>
                    </button>
                  </td>
                </tr>
              </tbody>

              <tfoot className="bg-surface-container-low font-title-sm text-title-sm text-on-surface">
                <tr>
                  <td className="py-3.5 px-4" colspan="5">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
                      <span>Total 87 Transaksi Penjualan (Halaman 1 dari 9)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-primary font-title-md text-title-md">Rp 12.500.000</td>
                  <td className="py-3.5 px-4 text-center text-on-surface-variant font-label-sm text-label-sm">Rekapitulasi</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-surface-container-lowest border-t border-slate-200">
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Menampilkan <span className="font-semibold text-on-surface">1 - 3</span> dari <span className="font-semibold text-on-surface">87</span> transaksi
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer" disabled type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center cursor-pointer" type="button">1</button>
              <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer" type="button">2</button>
              <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer" type="button">3</button>
              <span className="w-6 text-center text-on-surface-variant font-label-md text-label-md">...</span>
              <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors cursor-pointer" type="button">9</button>
              <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL EXPORT EXCEL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-6 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/15 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">table_chart</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Export Laporan Penjualan</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Format spreadsheet siap cetak &amp; pembukuan</p>
                </div>
              </div>
              <button onClick={handleCloseExport} className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Target File:</span>
                <span className="font-title-sm text-title-sm text-primary font-mono">Laporan_Penjualan_2026-09-15.xlsx</span>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Standarisasi Format Data:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Header tebal + warna</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Border tiap cell</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Kolom mata uang (Rp)</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                  <span>Baris summary total</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-slate-200">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              <span>Mencakup 87 baris data transaksi dari periode terpilih (15 Sep 2026).</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button onClick={handleCloseExport} className="h-10 px-5 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer" type="button">
                Batal
              </button>
              <button 
                onClick={handleConfirmDownload}
                disabled={isDownloading}
                className="h-10 px-6 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50" 
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isDownloading ? 'sync' : downloadSuccess ? 'check' : 'download'}
                </span>
                <span>{isDownloading ? 'Mengunduh...' : downloadSuccess ? 'Berhasil Diunduh' : 'Unduh File .xlsx'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW STRUK */}
      {receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-title-md text-title-md text-on-surface">Preview Struk Kasir</span>
              <button onClick={() => setReceiptData(null)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl font-mono text-body-sm flex flex-col gap-2 border border-slate-200">
              <div className="text-center font-bold pb-2 border-b border-dashed border-slate-300">
                <div>POS TOKO RETAIL</div>
                <div className="text-label-sm text-on-surface-variant font-normal">Cabang Utama (Pusat)</div>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>No. Trx:</span>
                <span className="font-bold text-primary">{receiptData.no}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>Waktu:</span>
                <span>{receiptData.time}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>Kasir:</span>
                <span>{receiptData.cashier}</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>Metode:</span>
                <span>{receiptData.method}</span>
              </div>
              <div className="py-2 border-t border-b border-dashed border-slate-300 my-1 flex justify-between font-bold">
                <span>TOTAL:</span>
                <span className="text-primary font-title-sm">{receiptData.total}</span>
              </div>
              <div className="text-center text-label-sm text-on-surface-variant pt-1 font-sans">
                Terima kasih atas kunjungan Anda! 😊
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setReceiptData(null)} className="h-9 px-4 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md cursor-pointer" type="button">
                Tutup
              </button>
              <button onClick={() => { alert('Mencetak struk ke printer thermal...'); setReceiptData(null); }} className="h-9 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1 hover:opacity-90 transition-all cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Cetak Ulang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}