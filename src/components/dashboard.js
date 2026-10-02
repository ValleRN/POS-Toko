import React from 'react';

const Dashboard = () => {
  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6">
        
        {/* Header Dashboard & Filter Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-medium">Dashboard</span>
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-7 bg-primary rounded-full"></div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Dashboard Penjualan
              </h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-surface-container-high rounded-xl p-1 gap-1">
              <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md font-semibold transition-all" type="button">
                Hari Ini
              </button>
              <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all" type="button">
                7 Hari Terakhir
              </button>
              <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all" type="button">
                Bulan Ini
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 transition-all" type="button">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Laporan</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Penjualan */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Total Penjualan Hari Ini</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">Rp 4.250.000</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
              <span className="inline-flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> 12.5%
              </span>
              <span className="text-on-surface-variant">vs kemarin (Rp 3.78M)</span>
            </div>
          </div>

          {/* Card 2: Total Transaksi */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Total Transaksi</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                  128 <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Nota</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">point_of_sale</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
              <span className="inline-flex items-center text-secondary font-medium bg-surface-container px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[14px]">add</span> 8 Nota
              </span>
              <span className="text-on-surface-variant">vs kemarin</span>
            </div>
          </div>

          {/* Card 3: Total Produk Aktif */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Total Produk Aktif</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                  245 <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Item</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-secondary">
                4 Kategori Terdaftar
              </span>
            </div>
          </div>

          {/* Card 4: Stok Menipis */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Stok Menipis</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                  12 <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Produk</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-secondary font-label-sm text-label-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Perlu Restok
              </span>
            </div>
          </div>
        </div>

        {/* Tren Penjualan (Chart) */}
        <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Tren Penjualan 7 Hari Terakhir</h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">9 September – 15 September 2026 (Puncak Transaksi Hari Ini)</span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span>Omzet Penjualan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span>Rata-rata Target</span>
              </div>
            </div>
          </div>
          
          {/* Chart Bars */}
          <div className="relative w-full h-64 pt-4 flex flex-col justify-between">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pb-8">
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
              <div className="w-full h-px bg-surface-variant"></div>
            </div>
            <div className="relative z-10 grid grid-cols-7 h-48 items-end gap-2 sm:gap-6 px-2">
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 3.1M</span>
                <div className="w-full max-w-[36px] bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "52%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">09 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 3.4M</span>
                <div className="w-full max-w-[36px] bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "58%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">10 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 3.8M</span>
                <div className="w-full max-w-[36px] bg-secondary-container rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "68%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">11 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 3.6M</span>
                <div className="w-full max-w-[36px] bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "62%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">12 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 4.0M</span>
                <div className="w-full max-w-[36px] bg-secondary-container rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "76%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">13 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <span className="font-label-sm text-label-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Rp 3.9M</span>
                <div className="w-full max-w-[36px] bg-secondary-container rounded-t-lg transition-all duration-300 group-hover:bg-primary" style={{ height: "72%" }}></div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">14 Sep</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <div className="bg-primary text-white px-2.5 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm font-semibold whitespace-nowrap">Rp 4.25M</div>
                <div className="w-full max-w-[36px] bg-primary rounded-t-lg transition-all duration-300 shadow-sm" style={{ height: "96%" }}></div>
                <span className="font-label-sm text-label-sm text-primary font-bold">15 Sep (Hari ini)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Kolom: Terlaris & Stok Menipis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Produk Terlaris */}
          <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Produk Terlaris Hari Ini</h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Top 5 SKU</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    <th className="py-2.5 px-3 rounded-l-lg">Produk</th>
                    <th className="py-2.5 px-3 text-center">Terjual</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total Omzet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent font-body-sm text-body-sm">
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center font-title-sm text-title-sm text-secondary font-semibold">1</div>
                        <div className="flex flex-col">
                          <span className="font-title-sm text-title-sm text-on-surface font-medium">Indomie Goreng Special</span>
                          <span className="text-on-surface-variant font-label-sm text-label-sm">SKU-00101 • Makanan</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-medium font-label-sm text-label-sm border border-slate-200">48 pcs</span>
                    </td>
                    <td className="py-3 px-3 text-right font-title-sm text-title-sm text-on-surface font-semibold">Rp 168.000</td>
                  </tr>
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center font-title-sm text-title-sm text-secondary font-semibold">2</div>
                        <div className="flex flex-col">
                          <span className="font-title-sm text-title-sm text-on-surface font-medium">Aqua Botol 600ml</span>
                          <span className="text-on-surface-variant font-label-sm text-label-sm">SKU-00204 • Minuman</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-medium font-label-sm text-label-sm border border-slate-200">36 pcs</span>
                    </td>
                    <td className="py-3 px-3 text-right font-title-sm text-title-sm text-on-surface font-semibold">Rp 144.000</td>
                  </tr>
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center font-title-sm text-title-sm text-secondary font-semibold">3</div>
                        <div className="flex flex-col">
                          <span className="font-title-sm text-title-sm text-on-surface font-medium">Teh Botol Sosro 450ml</span>
                          <span className="text-on-surface-variant font-label-sm text-label-sm">SKU-00210 • Minuman</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-medium font-label-sm text-label-sm border border-slate-200">28 pcs</span>
                    </td>
                    <td className="py-3 px-3 text-right font-title-sm text-title-sm text-on-surface font-semibold">Rp 168.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Peringatan Stok Menipis */}
          <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">notification_important</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Peringatan Stok Menipis</h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Stok &lt; 10 Unit</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                    <th className="py-2.5 px-3 rounded-l-lg">Produk</th>
                    <th className="py-2.5 px-3 text-center">Sisa</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent font-body-sm text-body-sm">
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-title-sm text-title-sm text-on-surface font-medium block">Aqua Botol 600ml</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">Minuman</span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-on-surface">7 pcs</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium inline-flex items-center border border-slate-200">Rendah</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium transition-colors" type="button">+ Restok</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-title-sm text-title-sm text-on-surface font-medium block">Gula Pasir Gulaku 1kg</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">Sembako</span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-secondary">3 pcs</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium inline-flex items-center border border-slate-200">Kritis</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium transition-colors" type="button">+ Restok</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-title-sm text-title-sm text-on-surface font-medium block">Sabun Mandi Lifebuoy</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">Perawatan</span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-secondary">0 pcs</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-secondary font-label-sm text-label-sm font-medium inline-flex items-center">Habis</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="px-2.5 py-1 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium transition-colors" type="button">+ Restok</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Transaksi Terbaru */}
        <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Transaksi Terbaru</h2>
            </div>
            <a className="font-label-md text-label-md text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto" href="#">
              <span>Lihat Semua Transaksi</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                  <th className="py-3 px-4 rounded-l-lg">ID Transaksi</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Kasir</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent font-body-sm text-body-sm">
                <tr className="hover:bg-surface transition-colors">
                  <td className="py-3.5 px-4 font-title-sm text-title-sm text-on-surface font-semibold">TRX-20260915-128</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">21:45 WIB</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-low border border-slate-200 flex items-center justify-center font-label-sm text-label-sm font-semibold text-secondary">V</div>
                      <span className="text-on-surface font-medium">Valle</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-secondary">qr_code_scanner</span> QRIS
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-title-sm text-title-sm text-on-surface font-semibold">Rp 78.500</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-label-sm text-label-sm font-medium">Sukses</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container-low text-secondary font-label-sm text-label-sm font-medium transition-colors" type="button">Detail</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Dashboard;