import React, { useState } from 'react';

export default function ProductInventoryPage() {
  // State navigasi tab ('list' atau 'add')
  const [activeTab, setActiveTab] = useState('list');

  // State daftar produk (mock data)
  const [products, setProducts] = useState([
    {
      code: 'PRD001',
      name: 'Indomie Goreng Special',
      sku: '899886620011',
      category: 'Makanan',
      buyPrice: 2800,
      nettPrice: 3500,
      stock: 150,
      unit: 'pcs',
      updated: 'Hari ini, 10:45',
      updatedBy: 'Admin Kasir',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUpICASvcYHruWB3gLZZVe0MXuA_ptWt8rTIaCVTysAlhE2Xb8tGHvfXFYz4PwW-IHWha9H-LRb94vGPELCF2gFJlpjqVXwdpz4o4xDB7D8LgehNk5o-5Usy4fbTdTz_jkAsI3okVPFMSCvP8QRTGyDxEYyEuUGBLAo925Tqm2qRO-2fORixIIABtIM8ajJZ9DSDlYNekRnWnwLZgNWudbA1BcDMVXzCtjaxu-dapSE6ZmRRhO1Pg',
      status: 'active'
    },
    {
      code: 'PRD002',
      name: 'Aqua Botol 600ml',
      sku: '888600810109',
      category: 'Minuman',
      buyPrice: 3000,
      nettPrice: 4000,
      stock: 7,
      unit: 'pcs',
      updated: 'Hari ini, 08:30',
      updatedBy: 'Admin Kasir',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPhoMoBxXT72iB9ivIge3o2EoVSFt3rsTp6K_4tpD4PCRdobO_FmijPlSeNQ67VMCg3ONlqqT0uCsHXKF-JiOE6v2TG0H379mVYPX3-FPCdSapvLDZM8hRdYNjHJL3P4AGV-IigIRMAZYlwa28isV1HdMdodWskyBW37KXBN82hG_QGUocvGD2UbSQVjLqSHOejGbCU68qIycGQfPC5mTe6JCcmIIMzeDr1zJgW3WdL9DaPTioZiU',
      status: 'active'
    },
    {
      code: 'PRD004',
      name: 'Gula Pasir Gulaku 1kg',
      sku: '899317511019',
      category: 'Sembako',
      buyPrice: 12000,
      nettPrice: 14000,
      stock: 3,
      unit: 'pcs',
      updated: '10 Okt, 11:20',
      updatedBy: 'Super Admin',
      image: null,
      status: 'active'
    }
  ]);

  // State Form Tambah Produk
  const [newSku, setNewSku] = useState('PRD008');
  const [newCategory, setNewCategory] = useState('Makanan');
  const [newName, setNewName] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newBuyPrice, setNewBuyPrice] = useState(4000);
  const [newNettPrice, setNewNettPrice] = useState(5000);
  const [newStock, setNewStock] = useState(50);

  // State Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  // State Modal Konfirmasi Hapus Produk
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // State Modal Stok Cepat
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalData, setStockModalData] = useState({ code: '', name: '', currentStock: 0 });
  const [addedStockQty, setAddedStockQty] = useState(50);
  const [stockNotes, setStockNotes] = useState('Restok dari supplier');

  // State Toast Notification
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const showNotification = (title, message) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '' });
    }, 3500);
  };

  // Kalkulasi Harga Kasir (PPN 5%)
  const calculateCashierPrice = (nett) => Math.round(nett * 1.05);

  // Handler Simpan Produk Baru
  const handleSaveNewProduct = (e) => {
    e.preventDefault();
    const newProd = {
      code: newSku,
      name: newName,
      sku: newBarcode || '899' + Math.floor(100000000 + Math.random() * 900000000),
      category: newCategory,
      buyPrice: Number(newBuyPrice),
      nettPrice: Number(newNettPrice),
      stock: Number(newStock),
      unit: 'pcs',
      updated: 'Baru saja',
      updatedBy: 'Super Admin',
      image: null,
      status: 'active'
    };
    setProducts([newProd, ...products]);
    showNotification('Produk Baru Disimpan', `${newSku} (${newName}) berhasil ditambahkan.`);
    setActiveTab('list');
    setNewName('');
  };

  // Handler Buka Modal Edit
  const handleOpenEdit = (prod) => {
    setEditProductData({ ...prod });
    setIsEditModalOpen(true);
  };

  // Handler Simpan Edit Produk
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.code === editProductData.code ? editProductData : p));
    setIsEditModalOpen(false);
    showNotification('Perubahan Disimpan', `Data produk ${editProductData.code} berhasil diperbarui.`);
  };

  // Handler Buka Modal Konfirmasi Hapus
  const handleOpenDelete = (prod) => {
    setProductToDelete(prod);
    setIsDeleteModalOpen(true);
  };

  // Handler Eksekusi Hapus Produk
  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.code !== productToDelete.code));
      setIsDeleteModalOpen(false);
      showNotification('Produk Dihapus', `Produk ${productToDelete.name} berhasil dihapus dari sistem.`);
      setProductToDelete(null);
    }
  };

  // Handler Buka Modal Tambah Stok
  const handleOpenStock = (prod) => {
    setStockModalData({ code: prod.code, name: prod.name, currentStock: prod.stock });
    setAddedStockQty(50);
    setIsStockModalOpen(true);
  };

  // Handler Konfirmasi Tambah Stok
  const handleConfirmStock = () => {
    setProducts(products.map(p => {
      if (p.code === stockModalData.code) {
        return { ...p, stock: p.stock + Number(addedStockQty), updated: 'Baru saja' };
      }
      return p;
    }));
    setIsStockModalOpen(false);
    showNotification('Stok Berhasil Ditambahkan', `${addedStockQty} pcs sukses ditambahkan ke sistem.`);
  };

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6">
        
        {/* Header Sesuai Persis dengan Page Transaksi */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-medium">Daftar Produk</span>
            </nav>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-7 bg-primary rounded-full"></div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Daftar Produk &amp; Stok Toko
              </h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-slate-200 text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all cursor-pointer" type="button">
              <span className="material-symbols-outlined text-[18px] text-tertiary">download</span>
              <span>Export Excel (.xlsx)</span>
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 transition-all cursor-pointer" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        {/* Info Deskripsi Tambahan */}
        <div className="flex flex-wrap items-center gap-2 -mt-2">
          <p className="font-body-md text-body-md text-on-surface-variant">Kelola informasi katalog, sinkronisasi margin pajak kasir, dan penyesuaian inventaris realtime.</p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-slate-200">
            <span className="material-symbols-outlined text-[14px] text-tertiary">sync</span> Sinkronisasi terakhir: Hari ini, 10:45 WIB
          </span>
        </div>

        {/* VIEW: DAFTAR PRODUK (LIST) */}
        {activeTab === 'list' && (
          <div className="flex flex-col gap-6 w-full">
            {/* 4 KPI Cards Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">Total Katalog</span>
                    <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                      {products.length + 241} <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Item</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-secondary">
                    Dari 8 kategori aktif
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">Stok Aman</span>
                    <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">219</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="inline-flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    89.3% kondisi prima
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">Stok Menipis</span>
                    <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">18</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-[22px]">warning</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-amber-600">
                    Perlu pengadaan ulang
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface-variant">Habis / Kritis</span>
                    <span className="font-headline-md text-headline-md text-rose-600 mt-1 tracking-tight">8</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <span className="material-symbols-outlined text-[22px]">production_quantity_limits</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-rose-600">
                    Segera pesan ke supplier
                  </span>
                </div>
              </div>
            </div>

            {/* Tabel Produk Utama */}
            <div className="bg-surface-container-lowest rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              
              {/* Toolbar Filter */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/40">
                <div className="relative flex-1 max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </div>
                  <input type="text" placeholder="Cari kode atau nama produk..." className="w-full pl-10 pr-10 py-2 font-body-sm text-body-sm bg-white border border-slate-200 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline cursor-pointer hover:text-on-surface">barcode_scanner</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                    <option>Semua Kategori</option>
                  </select>
                  <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                    <option>Semua Status</option>
                  </select>
                  <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none">
                    <option>Urut: Nama A-Z</option>
                  </select>
                </div>
              </div>

              {/* Isi Tabel */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm min-w-[1100px]">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4 w-28">Kode</th>
                      <th className="py-3 px-4 min-w-[240px]">Nama Produk</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4 text-right">Harga Beli</th>
                      <th className="py-3 px-4 text-right">Harga Jual (Nett)</th>
                      <th className="py-3 px-4 text-right">Harga Kasir (+5%)</th>
                      <th className="py-3 px-4 text-center">Stok</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Terakhir Diperbarui</th>
                      <th className="py-3 px-4 text-center min-w-[200px]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-on-surface">
                    {products.map((p, idx) => {
                      const cashierPrice = calculateCashierPrice(p.nettPrice);
                      let statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-medium border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Stok Aman</span>;
                      if (p.stock <= 3) {
                        statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-label-sm text-label-sm font-medium border border-rose-100"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Kritis</span>;
                      } else if (p.stock <= 10) {
                        statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-label-sm text-label-sm font-medium border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Menipis</span>;
                      }

                      return (
                        <tr key={p.code} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3.5 px-4 text-center text-on-surface-variant font-medium">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-mono font-title-sm text-title-sm text-slate-700">{p.code}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {p.image ? (
                                <img className="w-9 h-9 rounded-lg object-cover bg-surface-container-high shrink-0" src={p.image} alt={p.name} />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[12px] shrink-0">
                                  {p.name.slice(0, 3).toUpperCase()}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-title-sm text-title-sm text-on-surface leading-tight">{p.name}</span>
                                <span className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">SKU: {p.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4"><span className="inline-flex px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-label-sm text-label-sm">{p.category}</span></td>
                          <td className="py-3.5 px-4 text-right font-medium text-on-surface-variant">Rp {p.buyPrice.toLocaleString('id-ID')}</td>
                          <td className="py-3.5 px-4 text-right font-medium text-on-surface">Rp {p.nettPrice.toLocaleString('id-ID')}</td>
                          <td className="py-3.5 px-4 text-right font-title-sm text-title-sm text-primary font-semibold">Rp {cashierPrice.toLocaleString('id-ID')}</td>
                          <td className="py-3.5 px-4 text-center font-title-sm text-title-sm text-on-surface">{p.stock} <span className="text-on-surface-variant font-normal font-label-sm">{p.unit}</span></td>
                          <td className="py-3.5 px-4 text-center">{statusBadge}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-on-surface font-medium">{p.updated}</span>
                              <span className="text-[11px] text-on-surface-variant">{p.updatedBy}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenStock(p)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-primary-container/20 text-primary hover:bg-primary hover:text-white transition-colors font-label-sm text-label-sm font-medium cursor-pointer"
                                title="Tambah Stok"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[15px]">add</span><span>Stok</span>
                              </button>
                              <button 
                                onClick={() => handleOpenEdit(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium transition-colors cursor-pointer"
                                title="Edit Produk"
                                type="button"
                              >
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleOpenDelete(p)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Hapus Produk"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-surface-container-low flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>Menampilkan <strong>1 - {products.length}</strong> dari <strong>245</strong> produk</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TAMBAH PRODUK BARU */}
        {activeTab === 'add' && (
          <div className="flex flex-col gap-6 w-full mb-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-1 bg-primary rounded-full"></div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Tambah Produk Baru</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('list')} 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-label-md font-label-md cursor-pointer transition-colors" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span> Kembali ke Daftar
                </button>
              </div>

              <form onSubmit={handleSaveNewProduct} className="flex flex-col gap-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Kolom Kiri: Informasi Dasar */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Kode Produk / SKU <span className="text-error">*</span></label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required 
                            value={newSku} 
                            onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                            className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-mono font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container uppercase border border-slate-200" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setNewSku('PRD' + Math.floor(100 + Math.random() * 900))} 
                            className="absolute right-2 top-2 text-label-sm font-label-sm text-primary hover:underline cursor-pointer"
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Kategori <span className="text-error">*</span></label>
                        <select 
                          value={newCategory} 
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-slate-200"
                        >
                          <option value="Makanan">Makanan</option>
                          <option value="Minuman">Minuman</option>
                          <option value="Sembako">Sembako</option>
                          <option value="Kebutuhan RT">Kebutuhan RT</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-medium">Nama Produk <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Contoh: Biskuit Roma Kelapa 300g" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Barcode EAN/UPC</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="8991234567890" 
                            value={newBarcode}
                            onChange={(e) => setNewBarcode(e.target.value)}
                            className="w-full h-10 px-3 pr-10 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-[20px] text-outline">qr_code_scanner</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Satuan</label>
                        <select className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-slate-200">
                          <option>pcs (Pieces)</option>
                          <option>box (Kardus)</option>
                          <option>pack (Paket)</option>
                          <option>kg (Kilogram)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Kolom Kanan: Harga, PPN 5% & Stok Awal */}
                  <div className="md:col-span-5 flex flex-col gap-4 bg-surface-container-low p-4 rounded-xl border border-slate-200">
                    <div className="font-title-sm text-title-sm text-on-surface flex items-center gap-1.5 pb-2 border-b border-slate-200">
                      <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                      <span>Kalkulasi Harga &amp; Margin Kasir</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-medium">Harga Beli (Modal)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant">Rp</span>
                        <input 
                          type="number" 
                          min="0" 
                          value={newBuyPrice}
                          onChange={(e) => setNewBuyPrice(e.target.value)}
                          className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest font-mono font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-label-md text-on-surface font-medium">Harga Jual (Nett Toko) <span className="text-error">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant">Rp</span>
                        <input 
                          type="number" 
                          min="0" 
                          value={newNettPrice}
                          onChange={(e) => setNewNettPrice(e.target.value)}
                          className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest font-mono font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-surface-container rounded-lg flex flex-col gap-1 border border-primary-container/20">
                      <div className="flex items-center justify-between">
                        <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">calculate</span>
                          Harga Kasir Otomatis (PPN Toko 5%):
                        </span>
                      </div>
                      <div className="text-headline-sm font-currency-display text-primary flex items-baseline gap-1 mt-1">
                        <span className="text-label-md font-label-md font-normal text-on-surface-variant">Rp</span>
                        <span>{calculateCashierPrice(newNettPrice).toLocaleString('id-ID')}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">Dihitung dari Nett + 5% untuk sinkronisasi POS kasir realtime.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Stok Awal</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-label-md text-on-surface font-medium">Batas Minimum</label>
                        <input type="number" min="1" defaultValue="10" className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => setActiveTab('list')} className="h-10 px-5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-colors cursor-pointer">Batal</button>
                  <button type="submit" className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">save</span> Simpan &amp; Tambahkan ke Katalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: EDIT PRODUK */}
      {isEditModalOpen && editProductData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
            <div className="px-6 py-4 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">edit_square</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Edit Informasi Produk</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Perbarui detail katalog barang, harga jual, dan status ketersediaan</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" onClick={() => setIsEditModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Kode Produk</label>
                  <input value={editProductData.code} readOnly className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-mono font-title-sm text-title-sm text-on-surface outline-none border border-slate-200 uppercase" type="text" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Nama Produk</label>
                  <input 
                    value={editProductData.name} 
                    onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" 
                    type="text" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Kategori</label>
                  <select 
                    value={editProductData.category}
                    onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 cursor-pointer"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Sembako">Sembako</option>
                    <option value="Kebutuhan RT">Kebutuhan RT</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Satuan</label>
                  <select className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 cursor-pointer">
                    <option value="pcs">Pcs</option>
                    <option value="kg">Kg</option>
                    <option value="bungkus">Bungkus</option>
                    <option value="botol">Botol</option>
                    <option value="dus">Dus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Harga Beli (Modal)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant font-medium">Rp</span>
                    <input 
                      value={editProductData.buyPrice}
                      onChange={(e) => setEditProductData({ ...editProductData, buyPrice: Number(e.target.value) })}
                      className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" 
                      type="number" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Harga Jual</label>
                    <span className="text-label-sm font-label-sm text-emerald-700 font-medium">Margin: +25%</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant font-medium">Rp</span>
                    <input 
                      value={editProductData.nettPrice}
                      onChange={(e) => setEditProductData({ ...editProductData, nettPrice: Number(e.target.value) })}
                      className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" 
                      type="number" 
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant">Harga kasir otomatis setelah PPN 5%: Rp {calculateCashierPrice(editProductData.nettPrice).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Stok Tersedia</label>
                  <div className="relative flex items-center">
                    <input 
                      value={editProductData.stock}
                      onChange={(e) => setEditProductData({ ...editProductData, stock: Number(e.target.value) })}
                      className="w-full h-10 px-3 pr-12 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none border border-slate-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" 
                      type="number" 
                    />
                    <span className="absolute right-3 text-label-sm font-label-sm text-on-surface-variant">pcs</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Status Produk</label>
                  <div className="flex items-center gap-3 h-10">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-label-md font-medium cursor-pointer">
                      <input defaultChecked className="text-primary" name="productStatus" type="radio" value="active" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif
                    </label>
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-surface-container-low text-on-surface-variant text-label-md font-medium cursor-pointer">
                      <input className="text-primary" name="productStatus" type="radio" value="inactive" />
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> Nonaktif
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button className="h-10 px-5 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer" onClick={() => setIsEditModalOpen(false)} type="button">Batal</button>
                <button className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-lg text-label-lg shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer" type="submit">
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PRODUK */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                <span className="material-symbols-outlined text-[26px]">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Hapus Produk?</h3>
                <p className="text-xs text-slate-400">Katalog barang akan dihapus permanen.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-white">{productToDelete.name}</strong> ({productToDelete.code}) dari inventaris POS Toko? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                type="button"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Ya, Hapus Produk</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: TAMBAH STOK CEPAT */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">add_box</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface">Tambah Stok — {stockModalData.name}</h2>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" onClick={() => setIsStockModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">Stok Saat Ini:</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-title-sm text-title-sm border border-slate-200">
                  <span>{stockModalData.currentStock}</span>
                  <span className="text-[11px] text-slate-500 font-normal">pcs</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-medium">Jumlah Tambah <span className="text-error">*</span></label>
                <div className="relative flex items-center">
                  <input 
                    className="w-full h-10 px-3 pr-12 rounded-lg bg-surface-container-low font-title-sm text-title-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                    min="1" 
                    value={addedStockQty}
                    onChange={(e) => setAddedStockQty(e.target.value)}
                    placeholder="50" 
                    type="number" 
                  />
                  <span className="absolute right-3 text-label-sm font-label-sm text-on-surface-variant font-medium">pcs</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-medium">Keterangan</label>
                <input 
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-slate-200" 
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  placeholder="Restok dari supplier" 
                  type="text" 
                />
              </div>

              <div className="p-3 bg-surface rounded-lg flex items-center justify-between text-body-sm text-on-surface-variant border border-slate-200">
                <span className="flex items-center gap-1.5 font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">trending_up</span> Estimasi Stok Baru:
                </span>
                <span className="font-title-sm text-title-sm text-emerald-700 font-semibold">
                  {stockModalData.currentStock + (Number(addedStockQty) || 0)} pcs
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-end gap-2 border-t border-slate-200">
              <button className="h-10 px-4 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-slate-200 font-label-lg text-label-lg transition-colors cursor-pointer" onClick={() => setIsStockModalOpen(false)} type="button">Batal</button>
              <button className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-lg text-label-lg transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer" onClick={handleConfirmStock} type="button">
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-50 bg-tertiary text-on-tertiary px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[22px]">check_circle</span>
        <div className="flex flex-col">
          <span className="font-title-sm text-title-sm">{toast.title}</span>
          <span className="font-body-sm text-body-sm text-on-tertiary-container">{toast.message}</span>
        </div>
      </div>
    </main>
  );
}