import React, { useState, useEffect } from 'react';

export default function PengaturanPage() {
  // State Informasi Toko (Read-Only)
  const storeInfo = {
    name: 'Groseria',
    address: 'BSD City, Tangerang Selatan'
  };

  // State Metode Pembayaran
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    qris: true
  });

  // State Pengaturan Pajak & Loading
  const [taxSetting, setTaxSetting] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // State Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: '', isError: false });
    }, 3000);
  };

  // Fetch Pengaturan dari Backend Server
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/settings');
      if (res.ok) {
        const responseData = await res.json();
        const data = responseData.data || responseData;
        setTaxSetting(Number(data.tax_percentage || 5));
        setPaymentMethods({
          cash: data.payment_cash !== false,
          qris: data.payment_qris !== false
        });
      }
    } catch (err) {
      console.error('Gagal memuat pengaturan:', err);
      showToast('Gagal terhubung ke server backend', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Submit Perubahan Metode Pembayaran
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_cash: paymentMethods.cash,
          payment_qris: paymentMethods.qris,
          tax_percentage: Number(taxSetting)
        })
      });

      const data = await res.json();
      if (res.ok || data.status === 'success') {
        showToast('Metode pembayaran berhasil disimpan');
      } else {
        showToast(`Gagal menyimpan: ${data.message || 'Terjadi kesalahan'}`, true);
      }
    } catch (err) {
      console.error('Error simpan metode pembayaran:', err);
      showToast('Gagal terhubung ke server backend.', true);
    }
  };

  // Submit Perubahan Pajak
  const handleTaxSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_cash: paymentMethods.cash,
          payment_qris: paymentMethods.qris,
          tax_percentage: Number(taxSetting)
        })
      });

      const data = await res.json();
      if (res.ok || data.status === 'success') {
        showToast(`Pengaturan pajak berhasil disimpan: ${taxSetting}%`);
      } else {
        showToast(`Gagal menyimpan pajak: ${data.message || 'Terjadi kesalahan'}`, true);
      }
    } catch (err) {
      console.error('Error simpan pajak:', err);
      showToast('Gagal terhubung ke server backend.', true);
    }
  };

  if (isLoading) {
    return (
      <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span>Memuat pengaturan toko...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6 pb-12">
        
        {/* Header (Aman & Tidak Tertutup Header/Navbar) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-primary"></div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold text-2xl">
              Pengaturan Toko
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 text-sm">
            Kelola informasi gerai, metode pembayaran aktif, dan persentase pajak transaksi.
          </p>
        </div>

        {/* Main Stacked Content Cards */}
        <div className="flex flex-col gap-6">

          {/* Card 1: Informasi Toko (READ ONLY) */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">storefront</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-semibold text-lg">Informasi Toko</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Profil identitas toko sesuai pada struk belanja (Tampilan Saja)</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md font-medium border border-slate-200">
                Read-Only
              </span>
            </div>

            {/* Layout Atas-Bawah untuk Profil Toko */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium text-xs">Nama Toko</label>
                <input 
                  className="w-full h-10 px-3 rounded-lg bg-slate-100 text-slate-600 font-body-md text-body-md border border-slate-200 cursor-not-allowed select-none text-sm" 
                  type="text" 
                  value={storeInfo.name}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium text-xs">Alamat</label>
                <input 
                  className="w-full h-10 px-3 rounded-lg bg-slate-100 text-slate-600 font-body-md text-body-md border border-slate-200 cursor-not-allowed select-none text-sm" 
                  type="text" 
                  value={storeInfo.address}
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Card 2: Metode Pembayaran */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold text-lg">Metode Pembayaran</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Pilih metode pembayaran yang diizinkan aktif di terminal kasir</p>
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
                  <span className="font-title-sm text-title-sm text-on-surface font-medium text-sm">Tunai</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={paymentMethods.qris}
                    onChange={(e) => setPaymentMethods({ ...paymentMethods, qris: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer" 
                  />
                  <span className="font-title-sm text-title-sm text-on-surface font-medium text-sm">QRIS</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-90 transition-colors shadow-sm cursor-pointer text-sm font-semibold" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Simpan Metode Pembayaran</span>
                </button>
              </div>
            </form>
          </section>

          {/* Card 3: Pengaturan Pajak */}
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">percent</span>
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold text-lg">Pengaturan Pajak</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Atur persentase PPN toko yang otomatis menambahkan harga kasir</p>
              </div>
            </div>

            <form onSubmit={handleTaxSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 w-full md:w-1/3">
                <label className="font-label-md text-label-md text-on-surface font-medium text-xs" htmlFor="persentasePajak">Persentase Pajak (%)</label>
                <div className="flex items-center gap-3">
                  <input 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-slate-200 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono font-bold text-sm" 
                    id="persentasePajak" 
                    type="number" 
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxSetting}
                    onChange={(e) => setTaxSetting(Number(e.target.value))}
                  />
                  <span className="font-body-md text-body-md text-on-surface-variant font-bold">%</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm hover:opacity-90 transition-colors shadow-sm cursor-pointer text-sm font-semibold" type="submit">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Simpan Pengaturan Pajak</span>
                </button>
              </div>
            </form>
          </section>

        </div>

        {/* TOAST NOTIFICATION */}
        <div className={`fixed bottom-6 right-6 z-50 ${toast.isError ? 'bg-rose-600' : 'bg-slate-900'} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
          <span className="material-symbols-outlined text-emerald-400 text-[22px]">
            {toast.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-body-md text-body-md font-medium text-sm">{toast.message}</span>
        </div>

      </div>
    </main>
  );
}
