import React, { useState, useEffect } from 'react';

// Komponen Helper untuk Animasi Angka dari 0 ke Target (Counting Up)
function AnimatedNumber({ value, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const targetValue = Number(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Menggunakan fungsi Easing (Ease-Out Quad) agar animasi melambat di akhir
      const easeOutProgress = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.floor(easeOutProgress * targetValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

export default function ProductInventoryPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State (10 Produk per Halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // User logged in info
  const currentUser = JSON.parse(localStorage.getItem('groseria_user')) || { name: 'Admin Groseria' };

  // Fetch Data Produk dari Backend API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Gagal memuat');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal load data produk:", error);
      showNotification('Error', 'Gagal memuat data dari database', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset Halaman ke Page 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  // Kalkulasi KPI Dinamis
  const totalCategories = new Set(products.map(p => p.category)).size;
  const safeStock = products.filter(p => p.stock > 10).length;
  const warningStock = products.filter(p => p.stock > 3 && p.stock <= 10).length;
  const criticalStock = products.filter(p => p.stock <= 3).length;
  const safePercentage = products.length > 0 ? ((safeStock / products.length) * 100).toFixed(1) : 0;

  // Filtered Products (termasuk filter status 'habis')
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    let pStatus = 'aman';
    if (p.stock === 0) pStatus = 'habis';
    else if (p.stock <= 3) pStatus = 'kritis';
    else if (p.stock <= 10) pStatus = 'menipis';

    const matchStatus = statusFilter === 'all' || pStatus === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  // Logika Paginasi
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // State Modal Tambah Produk (Pop-Up)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState('Makanan');
  const [newName, setNewName] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newBuyPrice, setNewBuyPrice] = useState(0);
  const [newNettPrice, setNewNettPrice] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const [newUnit, setNewUnit] = useState('pcs');

  // Handler Buka Modal Tambah Produk & Auto-generate SKU
  const handleOpenAddModal = () => {
    setNewSku(`PRD${String(products.length + 1).padStart(3, '0')}`);
    setNewName('');
    setNewBarcode('');
    setNewCategory('Makanan');
    setNewBuyPrice(0);
    setNewNettPrice(0);
    setNewStock(0);
    setNewUnit('pcs');
    setIsAddModalOpen(true);
  };

  // State Modals & Toast
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalData, setStockModalData] = useState({ id: null, code: '', name: '', currentStock: 0 });
  const [addedStockQty, setAddedStockQty] = useState(50);

  const [toast, setToast] = useState({ show: false, title: '', message: '', isError: false });
  const showNotification = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 3500);
  };

  const calculateCashierPrice = (nett) => Math.round(Number(nett || 0) * 1.05);

  // Handler Export Excel (CSV)
  const handleExportExcel = () => {
    if (products.length === 0) {
      showNotification('Export Gagal', 'Tidak ada data produk di database untuk diunduh.', true);
      return;
    }

    const headers = ['No', 'Kode Produk', 'Nama Produk', 'SKU', 'Kategori', 'Harga Modal (Rp)', 'Harga Jual Nett (Rp)', 'Harga Kasir (+5%) (Rp)', 'Stok', 'Satuan', 'Status', 'Terakhir Diperbarui'];
    
    const rows = products.map((p, idx) => {
      let statusStr = 'Aman';
      if (p.stock === 0) statusStr = 'Habis';
      else if (p.stock <= 3) statusStr = 'Kritis';
      else if (p.stock <= 10) statusStr = 'Menipis';

      const cashierPrice = calculateCashierPrice(p.nettPrice);

      return [
        idx + 1,
        `"${p.code}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku || '-'}"`,
        `"${p.category}"`,
        p.buyPrice,
        p.nettPrice,
        cashierPrice,
        p.stock,
        `"${p.unit}"`,
        `"${statusStr}"`,
        `"${new Date(p.updatedAt).toLocaleString('id-ID')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Data_Produk_Groseria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Export Berhasil', 'Data produk berhasil diunduh dalam format Excel (CSV).');
  };

  // API Handlers (Validasi Kelengkapan Field Ditambahkan)
  const handleSaveNewProduct = async (e) => {
    e.preventDefault();

    // Pengecekan Validasi: Pastikan semua field terisi
    if (
      !newSku.trim() || 
      !newName.trim() || 
      !newBarcode.trim() || 
      !newCategory || 
      !newUnit || 
      newBuyPrice === '' || Number(newBuyPrice) <= 0 || 
      newNettPrice === '' || Number(newNettPrice) <= 0 || 
      newStock === '' || Number(newStock) < 0
    ) {
      showNotification('Gagal Simpan', 'Semua kolom input wajib diisi dengan benar.', true);
      return;
    }

    const payload = {
      code: newSku.trim(), name: newName.trim(), sku: newBarcode.trim(), category: newCategory,
      buyPrice: Number(newBuyPrice), nettPrice: Number(newNettPrice),
      stock: Number(newStock), unit: newUnit, status: 'active', updatedBy: currentUser.name
    };

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Gagal menyimpan produk');
      await fetchProducts();
      showNotification('Produk Baru Disimpan', `${newSku} (${newName}) berhasil ditambahkan.`);
      setIsAddModalOpen(false);
    } catch (err) {
      showNotification('Gagal Simpan', err.message || 'Terjadi kesalahan', true);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const payload = { ...editProductData, updatedBy: currentUser.name };
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editProductData.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Gagal memperbarui');
      await fetchProducts();
      setIsEditModalOpen(false);
      showNotification('Perubahan Disimpan', `Data produk ${editProductData.code} berhasil diperbarui.`);
    } catch (err) {
      showNotification('Gagal Update', 'Terjadi kesalahan saat memperbarui data', true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      showNotification('Produk Dihapus', `Produk ${productToDelete.name} berhasil dihapus.`);
    } catch (err) {
      showNotification('Gagal Hapus', 'Terjadi kesalahan saat menghapus data', true);
    }
  };

  const handleConfirmStock = async () => {
    const newStockVal = stockModalData.currentStock + Number(addedStockQty);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${stockModalData.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock: newStockVal, updatedBy: currentUser.name })
      });
      if (!res.ok) throw new Error('Gagal update stok');
      await fetchProducts();
      setIsStockModalOpen(false);
      showNotification('Stok Ditambahkan', `${addedStockQty} pcs sukses ditambahkan.`);
    } catch (err) {
      showNotification('Gagal', 'Gagal menambahkan stok', true);
    }
  };

  const handleOpenEdit = (prod) => { setEditProductData({ ...prod }); setIsEditModalOpen(true); };
  const handleOpenDelete = (prod) => { setProductToDelete(prod); setIsDeleteModalOpen(true); };
  const handleOpenStock = (prod) => { 
    setStockModalData({ id: prod.id, code: prod.code, name: prod.name, currentStock: prod.stock }); 
    setAddedStockQty(50); 
    setIsStockModalOpen(true); 
  };

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6">
        
        {/* Header Utama */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-primary rounded-full"></div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
              Daftar Produk &amp; Stok Toko
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button 
              onClick={handleExportExcel} 
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-slate-200 text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all cursor-pointer" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-tertiary">download</span>
              <span>Export Excel (.xlsx)</span>
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-95 transition-all cursor-pointer" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah Produk Baru</span>
            </button>
          </div>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant -mt-4">
          Kelola informasi katalog, sinkronisasi margin pajak kasir, dan penyesuaian inventaris realtime.
        </p>

        {/* DAFTAR PRODUK (LIST & KPI CARDS) */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* KPI Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Katalog */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Total Katalog</span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                    <AnimatedNumber value={products.length} /> <span className="font-title-sm text-title-sm text-on-surface-variant font-normal">Item</span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low border border-slate-200 font-medium text-secondary">
                  Dari {totalCategories} kategori aktif
                </span>
              </div>
            </div>

            {/* Card 2: Stok Aman */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Stok Aman</span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                    <AnimatedNumber value={safeStock} />
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="inline-flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {safePercentage}% kondisi prima
                </span>
              </div>
            </div>

            {/* Card 3: Stok Menipis */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Stok Menipis</span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1 tracking-tight">
                    <AnimatedNumber value={warningStock} />
                  </span>
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

            {/* Card 4: Habis / Kritis */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant">Habis / Kritis</span>
                  <span className="font-headline-md text-headline-md text-rose-600 mt-1 tracking-tight">
                    <AnimatedNumber value={criticalStock} />
                  </span>
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

          {/* Tabel Produk Utama & Toolbar Filter */}
          <div className="bg-surface-container-lowest rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            
            {/* Toolbar Filter */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/40">
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari kode, nama, atau SKU..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 font-body-sm text-body-sm bg-white border border-slate-200 rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Sembako">Sembako</option>
                  <option value="Kebutuhan RT">Kebutuhan RT</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 bg-white border border-slate-200 rounded-lg font-label-md text-label-md text-on-surface cursor-pointer focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="aman">Stok Aman</option>
                  <option value="menipis">Stok Menipis</option>
                  <option value="kritis">Stok Kritis</option>
                  <option value="habis">Stok Habis (0)</option>
                </select>

                {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                    className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-label-md text-label-md flex items-center gap-1 cursor-pointer transition-colors"
                    title="Reset Filter"
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tabel Data Produk */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm min-w-[1000px]">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-28">Kode</th>
                    <th className="py-3 px-4 min-w-[220px]">Nama Produk</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4 text-right">Modal</th>
                    <th className="py-3 px-4 text-right">Jual (Nett)</th>
                    <th className="py-3 px-4 text-right">Kasir (+5%)</th>
                    <th className="py-3 px-4 text-center">Stok</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Terakhir Diperbarui</th>
                    <th className="py-3 px-4 text-center min-w-[180px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low text-on-surface">
                  {isLoading ? (
                    <tr><td colSpan="11" className="text-center py-8 text-slate-500">Memuat data produk dari database...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="11" className="text-center py-8 text-slate-500">Tidak ada produk yang sesuai dengan pencarian / filter.</td></tr>
                  ) : (
                    currentProducts.map((p, idx) => {
                      const globalIndex = indexOfFirstItem + idx + 1;
                      const cashierPrice = calculateCashierPrice(p.nettPrice);
                      
                      // Status Badge (termasuk status Habis berwarna abu-abu)
                      let statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-medium border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aman</span>;
                      if (p.stock === 0) {
                        statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-label-sm text-label-sm font-medium border border-slate-200"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Habis</span>;
                      } else if (p.stock <= 3) {
                        statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-label-sm text-label-sm font-medium border border-rose-100"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Kritis</span>;
                      } else if (p.stock <= 10) {
                        statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-label-sm text-label-sm font-medium border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Menipis</span>;
                      }

                      return (
                        <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3.5 px-4 text-center text-on-surface-variant font-medium">{globalIndex}</td>
                          <td className="py-3.5 px-4 font-mono font-title-sm text-title-sm text-slate-700">{p.code}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-title-sm text-title-sm text-on-surface leading-tight font-semibold">{p.name}</span>
                              <span className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">SKU: {p.sku || '-'}</span>
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
                              <span className="font-label-md text-label-md text-on-surface font-medium">{formatTime(p.updatedAt)}</span>
                              <span className="text-[11px] text-on-surface-variant">Oleh: {p.updatedBy || 'Admin'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => handleOpenStock(p)} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-primary-container/20 text-primary hover:bg-primary hover:text-white transition-colors font-label-sm text-label-sm font-medium cursor-pointer" title="Tambah Stok" type="button">
                                <span className="material-symbols-outlined text-[15px]">add</span><span>Stok</span>
                              </button>
                              <button onClick={() => handleOpenEdit(p)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium transition-colors cursor-pointer" title="Edit Produk" type="button">
                                <span>Edit</span>
                              </button>
                              <button onClick={() => handleOpenDelete(p)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer" title="Hapus Produk" type="button">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Paginasi */}
            <div className="p-4 border-t border-slate-200 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 font-body-sm text-body-sm text-on-surface-variant">
              <span>
                Menampilkan <strong>{filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredProducts.length)}</strong> dari <strong>{filteredProducts.length}</strong> produk
              </span>

              <div className="flex items-center gap-1.5">
                {totalPages > 1 ? (
                  <>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 transition-colors ${
                        currentPage === 1 
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                          : 'text-slate-700 bg-white hover:bg-slate-100 cursor-pointer'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-title-sm text-title-sm font-semibold shadow-sm">
                      {currentPage}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 transition-colors ${
                        currentPage === totalPages 
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed' 
                          : 'text-slate-700 bg-white hover:bg-slate-100 cursor-pointer'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </>
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-title-sm text-title-sm font-semibold shadow-sm">
                    1
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL POP-UP: TAMBAH PRODUK BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
            <div className="px-6 py-4 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">add_box</span>
                </div>
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Tambah Produk Baru</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Isi rincian informasi barang dan harga jual</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" 
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Kode / SKU <span className="text-error">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      value={newSku} 
                      onChange={(e) => setNewSku(e.target.value.toUpperCase())} 
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-mono font-title-sm text-title-sm text-on-surface outline-none border border-slate-200 focus:ring-2 focus:ring-primary/20 uppercase" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setNewSku('PRD' + Math.floor(100 + Math.random() * 900))} 
                      className="absolute right-2 top-2.5 text-label-sm font-label-sm text-primary hover:underline cursor-pointer"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Kategori <span className="text-error">*</span></label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none border border-slate-200 cursor-pointer"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Sembako">Sembako</option>
                    <option value="Kebutuhan RT">Kebutuhan RT</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">Nama Produk <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Biskuit Roma Kelapa 300g" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none border border-slate-200 focus:ring-2 focus:ring-primary/20" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Barcode EAN/UPC <span className="text-error">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="8991234567890" 
                    value={newBarcode} 
                    onChange={(e) => setNewBarcode(e.target.value)} 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none border border-slate-200" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Satuan <span className="text-error">*</span></label>
                  <select 
                    value={newUnit} 
                    onChange={(e) => setNewUnit(e.target.value)} 
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface outline-none border border-slate-200 cursor-pointer"
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="sak">sak</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="font-title-sm text-title-sm text-on-surface flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                  <span>Harga &amp; Kalkulasi Kasir (+5%)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Harga Beli (Modal) <span className="text-error">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant">Rp</span>
                      <input 
                        type="number" 
                        min="1" 
                        required
                        value={newBuyPrice} 
                        onChange={(e) => setNewBuyPrice(e.target.value)} 
                        className="w-full h-10 pl-10 pr-3 rounded-lg bg-white font-title-sm text-title-sm text-on-surface outline-none border border-slate-200" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-label-md text-on-surface font-medium">Harga Jual (Nett) <span className="text-error">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-label-md font-label-md text-on-surface-variant">Rp</span>
                      <input 
                        type="number" 
                        min="1" 
                        required 
                        value={newNettPrice} 
                        onChange={(e) => setNewNettPrice(e.target.value)} 
                        className="w-full h-10 pl-10 pr-3 rounded-lg bg-white font-title-sm text-title-sm text-on-surface outline-none border border-slate-200" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg flex items-center justify-between border border-slate-200">
                  <span className="text-label-sm text-on-surface-variant">Harga Kasir Otomatis (+PPN):</span>
                  <span className="font-title-sm text-title-sm font-semibold text-primary">
                    Rp {calculateCashierPrice(newNettPrice).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Stok Awal <span className="text-error">*</span></label>
                  <input 
                    type="number" 
                    min="0" 
                    required
                    value={newStock} 
                    onChange={(e) => setNewStock(e.target.value)} 
                    className="w-full h-10 px-3 rounded-lg bg-white font-title-sm text-title-sm text-on-surface outline-none border border-slate-200" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="h-10 px-5 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-lg text-label-lg shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>Simpan &amp; Tambahkan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUK */}
      {isEditModalOpen && editProductData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
            <div className="px-6 py-4 bg-surface-container-low border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">edit_square</span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Edit Informasi Produk</h2>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" onClick={() => setIsEditModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Nama Produk</label>
                  <input value={editProductData.name} onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface outline-none border border-slate-200" type="text" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Kategori</label>
                  <select value={editProductData.category} onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })} className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-body-md text-body-md text-on-surface outline-none border border-slate-200 cursor-pointer">
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Sembako">Sembako</option>
                    <option value="Kebutuhan RT">Kebutuhan RT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Harga Beli</label>
                  <input value={editProductData.buyPrice} onChange={(e) => setEditProductData({ ...editProductData, buyPrice: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none border border-slate-200" type="number" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Harga Jual</label>
                  <input value={editProductData.nettPrice} onChange={(e) => setEditProductData({ ...editProductData, nettPrice: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest font-title-sm text-title-sm text-on-surface outline-none border border-slate-200" type="number" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button className="h-10 px-5 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors cursor-pointer" onClick={() => setIsEditModalOpen(false)} type="button">Batal</button>
                <button className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:opacity-90 shadow-sm transition-colors cursor-pointer" type="submit">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS PRODUK */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
            <h3 className="text-lg font-semibold text-white">Hapus Produk?</h3>
            <p className="text-sm text-slate-300">Apakah Anda yakin ingin menghapus <strong className="text-white">{productToDelete.name}</strong>?</p>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium cursor-pointer" type="button">Batal</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold cursor-pointer" type="button">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH STOK CEPAT */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
              <h2 className="font-title-lg text-title-lg text-on-surface">Tambah Stok: {stockModalData.name}</h2>
              <button className="p-1 rounded-lg hover:bg-surface-container cursor-pointer" onClick={() => setIsStockModalOpen(false)} type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-slate-200">
                <span className="font-label-md text-on-surface-variant">Stok Saat Ini:</span>
                <span className="font-title-sm text-slate-700">{stockModalData.currentStock} pcs</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-on-surface font-medium">Jumlah Tambah</label>
                <input className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-slate-200" min="1" value={addedStockQty} onChange={(e) => setAddedStockQty(e.target.value)} type="number" />
              </div>
            </div>
            <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-2 border-t border-slate-200">
              <button className="h-10 px-4 rounded-lg bg-surface-container-lowest border border-slate-200 cursor-pointer" onClick={() => setIsStockModalOpen(false)} type="button">Batal</button>
              <button className="h-10 px-5 rounded-lg bg-primary text-white cursor-pointer" onClick={handleConfirmStock} type="button">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div 
        className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        } ${
          toast.isError ? 'bg-rose-600 text-white' : 'bg-tertiary text-on-tertiary'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">
          {toast.isError ? 'error' : 'check_circle'}
        </span>
        <div className="flex flex-col">
          <span className="font-title-sm text-title-sm">{toast.title}</span>
          <span className="font-body-sm text-body-sm opacity-90">{toast.message}</span>
        </div>
      </div>
    </main>
  );
}