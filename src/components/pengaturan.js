import React, { useState } from 'react';

export default function PengaturanPage() {
  // State Informasi Toko
  const [storeInfo, setStoreInfo] = useState({
    name: 'POS Toko',
    address: 'Jl. Contoh No. 123, Jakarta Selatan',
    phone: '021-1234567'
  });

  // State Metode Pembayaran
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    qris: true,
    debit: true
  });

  // State Toast Notification
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    showToast('Informasi toko berhasil disimpan');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    showToast('Metode pembayaran berhasil disimpan');
  };

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6 pb-12">
        
        {/* Header & Breadcrumb (Konsisten full-width dengan garis aksen biru vertikal) */}
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Admin</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-medium">Pengaturan</span>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-primary"></div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
              Pengaturan Toko
            </h1>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Kelola informasi gerai dan metode pembayaran aktif.
          </p>
        </div>

        {/* Main Stacked Content Cards (Full width mengikuti struktur halaman lain) */}
        <div className="flex flex-col gap-6">

          {/* Card 1: Informasi Toko */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">storefront</span>
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Informasi Toko</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Profil identitas dan informasi operasional gerai</p>
              </div>
            </div>

            <form onSubmit={handleStoreSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="namaToko">Nama Toko</label>
                  <input 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-slate-200 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="namaToko" 
                    type="text" 
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="alamatToko">Alamat</label>
                  <input 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-slate-200 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="alamatToko" 
                    type="text" 
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="teleponToko">Telepon</label>
                  <input 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-slate-200 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                    id="teleponToko" 
                    type="text" 
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-90 transition-colors shadow-sm cursor-pointer" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </section>

          {/* Card 2: Metode Pembayaran */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Metode Pembayaran</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Pilih metode pembayaran yang diterima pada saat kasir memproses transaksi</p>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-6 py-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={paymentMethods.cash}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, cash: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer" 
                  />
                  <span className="font-title-sm text-title-sm text-on-surface font-medium">Tunai</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={paymentMethods.qris}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, qris: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer" 
                  />
                  <span className="font-title-sm text-title-sm text-on-surface font-medium">QRIS</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={paymentMethods.debit}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, debit: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer" 
                  />
                  <span className="font-title-sm text-title-sm text-on-surface font-medium">Debit</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-90 transition-colors shadow-sm cursor-pointer" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </section>

        </div>

        {/* TOAST NOTIFICATION */}
        <div className={`fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
          <span className="material-symbols-outlined text-tertiary-fixed text-[22px]">check_circle</span>
          <span className="font-body-md text-body-md font-medium">{toast.message}</span>
        </div>

      </div>
    </main>
  );
}