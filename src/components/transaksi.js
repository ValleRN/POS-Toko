import React, { useState } from 'react';

const Transaksi = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6">
        
        {/* Header Transaksi & Filter Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-medium">Transaksi</span>
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-7 bg-primary rounded-full"></div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Riwayat Transaksi
              </h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 transition-all" type="button">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards (Disamakan persis dengan gaya Dashboard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Transaksi Hari Ini */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Transaksi Hari Ini</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                  128 <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Nota</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-secondary">
                Kasir Aktif Berjalan
              </span>
            </div>
          </div>

          {/* Card 2: Omzet Tunai (Cash) */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Omzet Tunai (Cash)</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">Rp 1.850.000</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span className="inline-flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Metode Tunai
              </span>
            </div>
          </div>

          {/* Card 3: Omzet QRIS */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Omzet QRIS</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">Rp 1.625.000</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-indigo-600">
                Digital Payment
              </span>
            </div>
          </div>

          {/* Card 4: Omzet Debit */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">Omzet Debit</span>
                <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">Rp 775.000</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-sky-600">
                <span className="material-symbols-outlined text-[22px]">credit_card</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-sky-600">
                Kartu ATM / Debit
              </span>
            </div>
          </div>

        </div>

        {/* Tabel Transaksi Utama */}
        <div className="bg-surface-container-lowest rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          
          {/* Toolbar Filter */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/40">
            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">search</span>
              </div>
              <input type="text" placeholder="Cari ID transaksi, nama item, atau kasir..." defaultValue="TRX-20260915" className="w-full pl-10 pr-4 py-2 font-body-sm text-body-sm bg-white border border-slate-200 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                <option>Hari Ini</option>
              </select>
              <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                <option>Semua Kasir</option>
              </select>
              <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                <option>Semua Payment</option>
              </select>
            </div>
          </div>

          {/* Isi Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-5">ID Transaksi</th>
                  <th className="py-3 px-5">Waktu</th>
                  <th className="py-3 px-5">Kasir</th>
                  <th className="py-3 px-5">Item / Jumlah</th>
                  <th className="py-3 px-5">Total Belanja</th>
                  <th className="py-3 px-5">Payment</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-center">Aksi / Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-on-surface">
                
                {/* Baris Transaksi 1 */}
                <tr className="bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-5 font-semibold font-mono text-primary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> TRX-20260915-001
                  </td>
                  <td className="py-3.5 px-5 text-on-surface-variant">
                    <div className="font-medium text-on-surface">22:00 WIB</div>
                    <div className="text-[11px]">15 Sep 2026</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container-high border border-slate-200 flex items-center justify-center font-label-sm text-label-sm font-semibold text-secondary">V</span>
                      <span className="font-medium">Valle</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-on-surface-variant">
                    Indomie (3), Aqua (1), Teh Botol (2) <br/> <span className="text-xs text-slate-400">Total 6 item</span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-on-surface text-title-sm">Rp 25.725</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-label-sm text-label-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Cash (Tunai)
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Sukses</span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button onClick={openModal} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-medium hover:opacity-90 transition-all shadow-sm">
                      Struk (i)
                    </button>
                  </td>
                </tr>

                {/* Baris Transaksi 2 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold font-mono text-on-surface">TRX-20260915-002</td>
                  <td className="py-3.5 px-5 text-on-surface-variant">
                    <div className="font-medium text-on-surface">21:48 WIB</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container-high border border-slate-200 flex items-center justify-center font-label-sm text-label-sm font-semibold text-secondary">D</span>
                      <span className="font-medium">Dika</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-on-surface-variant">
                    Minyak Goreng 1L (2) <br/><span className="text-xs text-slate-400">Total 2 item</span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-on-surface text-title-sm">Rp 40.000</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-label-sm text-label-sm font-medium bg-surface-container-low text-secondary border border-slate-200">QRIS</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Sukses</span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium transition-colors">Detail</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-surface-container-low flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Menampilkan <strong>1 - 2</strong> dari <strong>128</strong> transaksi</span>
          </div>
        </div>

      </div>

      {/* ================= MODAL STRUK ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
            
            <div className="px-5 py-3.5 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <span className="font-title-sm text-title-sm text-on-surface">Detail Struk Transaksi</span>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg p-1 transition-colors">
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
                  <div className="flex justify-between"><span>No</span> <span>TRX-20260915-001</span></div>
                  <div className="flex justify-between"><span>Tgl</span> <span>15/09/2026 22:00</span></div>
                  <div className="flex justify-between"><span>Kasir</span> <span>Valle</span></div>
                </div>
                
                <div className="border-b-2 border-dashed border-slate-300 my-3"></div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold"><span>Indomie Goreng</span> <span>10.500</span></div>
                    <div className="flex justify-between text-on-surface-variant text-[10px]"><span>3 x 3.500</span> <span className="text-primary">Pjk: 525</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold"><span>Aqua Botol 600ml</span> <span>4.000</span></div>
                    <div className="flex justify-between text-on-surface-variant text-[10px]"><span>1 x 4.000</span> <span className="text-primary">Pjk: 200</span></div>
                  </div>
                </div>

                <div className="border-b border-slate-300 my-3"></div>
                <div className="flex justify-between text-sm font-bold py-1">
                  <span>TOTAL</span> <span className="text-primary">Rp 25.725</span>
                </div>
                <div className="border-b-2 border-slate-800 my-3"></div>
                
                <div className="flex justify-between"><span>Tunai (Cash)</span> <span>Rp 30.000</span></div>
                <div className="flex justify-between mt-1"><span>Kembalian</span> <span className="font-semibold">Rp 4.275</span></div>
                
                <div className="text-center font-sans text-[11px] text-on-surface-variant mt-6">
                  <p>Terima kasih telah berbelanja! 😊</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-slate-200 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
};

export default Transaksi;