import React, { useState, useEffect } from 'react';

// Custom Hook untuk Animasi Angka Berjalan (Count-Up Animation)
function useCountUp(endValue, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const targetValue = Number(endValue) || 0;

    if (targetValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing function (easeOutQuad) agar animasi melambat di akhir
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeProgress * (targetValue - startValue) + startValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(targetValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

// Sub-komponen khusus Angka Animasi
function AnimatedNumber({ value }) {
  const animatedValue = useCountUp(value);
  return <span>{animatedValue}</span>;
}

export default function PenggunaPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // State untuk Modal Konfirmasi Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // State untuk Modal Information Card
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State Form Modal
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'kasir'
  });

  const [showPassword, setShowPassword] = useState(false);

  // State Toast Notification
  const [toast, setToast] = useState({ show: false, title: '', message: '', isError: false });

  const showNotification = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 3500);
  };

  // Fetch data pengguna dari Database
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data dari server:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Format Waktu "Terakhir Login"
  const formatLastLogin = (dateStr) => {
    if (!dateStr) return 'Belum pernah login';
    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    if (isToday) {
      return `Hari ini, ${time} WIB`;
    }

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return `${formattedDate}, ${time} WIB`;
  };

  // Inisial Avatar
  const getInitials = (name) => {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Handler Buka Modal Info Card
  const handleOpenInfo = (user) => {
    setSelectedUser(user);
    setIsInfoModalOpen(true);
  };

  // Handler Buka Modal Tambah
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setCurrentUserId(null);
    setFormData({ name: '', username: '', password: '', confirmPassword: '', role: 'kasir' });
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleOpenEdit = (user) => {
    setIsEditMode(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      confirmPassword: '',
      role: user.role.toLowerCase()
    });
    setIsModalOpen(true);
  };

  // Handler Buka Modal Hapus
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Handler Eksekusi Hapus Pengguna ke Backend
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showNotification('Pengguna Dihapus', `Akun ${userToDelete.name} telah berhasil dihapus.`);
        fetchUsers();
      } else {
        showNotification('Gagal Hapus', 'Gagal menghapus pengguna.', true);
      }
    } catch (err) {
      showNotification('Error', 'Gagal terhubung ke server backend.', true);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Handler Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      showNotification('Validasi Gagal', 'Konfirmasi password tidak cocok!', true);
      return;
    }

    try {
      if (isEditMode) {
        const res = await fetch(`http://localhost:5000/api/users/${currentUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            role: formData.role
          })
        });

        if (res.ok) {
          showNotification('Berhasil Disimpan', `Data akun ${formData.name} berhasil diperbarui.`);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          const errData = await res.json();
          showNotification('Gagal Simpan', errData.message || 'Gagal memperbarui pengguna.', true);
        }
      } else {
        const res = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            role: formData.role
          })
        });

        if (res.ok) {
          showNotification('Berhasil Disimpan', `Data akun ${formData.name} berhasil ditambahkan.`);
          setIsModalOpen(false);
          fetchUsers();
        } else {
          const errData = await res.json();
          showNotification('Gagal Simpan', errData.message || 'Gagal menambah pengguna.', true);
        }
      }
    } catch (err) {
      showNotification('Error', 'Gagal terhubung ke server backend.', true);
    }
  };

  // Filter Data
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchStatus = statusFilter === 'all' || (statusFilter === 'aktif' ? u.status : !u.status);
    return matchSearch && matchRole && matchStatus;
  });

  // Hitung jumlah statistik
  const totalAdminCount = users.filter(u => u.role.toLowerCase() === 'admin').length;
  const totalKasirCount = users.filter(u => u.role.toLowerCase() === 'kasir').length;

  return (
    <main className="w-full pt-20 bg-background min-h-screen px-6 py-6 lg:px-8">
      <div className="flex flex-col w-full gap-6 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-primary"></div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Kelola Pengguna
              </h1>
            </div>
          </div>
          
          <button 
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 active:scale-[0.98] transition-all self-start lg:self-auto cursor-pointer" 
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Tambah Pengguna</span>
          </button>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant -mt-4">
          Manajemen akun staf, peran akses (Admin &amp; Kasir), serta hak otorisasi sistem Groseria
        </p>

        {/* Quick Stats Bento Grid DENGAN ANIMASI COUNT-UP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1: Total */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden border border-slate-200">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Terdaftar</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-currency-display text-currency-display text-on-surface">
                  <AnimatedNumber value={users.length} />
                </span>
                <span className="font-title-sm text-title-sm text-on-surface-variant">Akun Staf</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Seluruh akun terverifikasi</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[26px]">badge</span>
            </div>
          </div>

          {/* Stat 2: Admin */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden border border-slate-200">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Peran Admin</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-currency-display text-currency-display text-on-surface">
                  <AnimatedNumber value={totalAdminCount} />
                </span>
                <span className="font-title-sm text-title-sm text-on-surface-variant">Staf</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Akses: Dashboard, Stok, Laporan &amp; Pengaturan</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
            </div>
          </div>

          {/* Stat 3: Kasir */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden border border-slate-200">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold uppercase tracking-wider">Peran Kasir</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-currency-display text-currency-display text-on-surface">
                  <AnimatedNumber value={totalKasirCount} />
                </span>
                <span className="font-title-sm text-title-sm text-on-surface-variant">Staf</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">Akses Khusus: Transaksi Groseria &amp; Cetak Struk</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[26px]">point_of_sale</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-slate-200" 
                placeholder="Cari nama staf atau username..." 
                type="text" 
              />
            </div>
            
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative min-w-[140px] flex-1 sm:flex-none">
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface appearance-none cursor-pointer focus:outline-none border border-slate-200 pr-8"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>

              <div className="relative min-w-[140px] flex-1 sm:flex-none">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface appearance-none cursor-pointer focus:outline-none border border-slate-200 pr-8"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>

              <button 
                onClick={() => { setSearchQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}
                className="h-10 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer border border-slate-200" 
                title="Reset Filter" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm text-on-surface border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">No</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Staf</th>
                  <th className="py-3 px-4 min-w-[130px]">Username</th>
                  <th className="py-3 px-4 min-w-[120px]">Role / Akses</th>
                  <th className="py-3 px-4 min-w-[120px]">Status</th>
                  <th className="py-3 px-4 min-w-[170px]">Terakhir Login</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-on-surface-variant">
                      Memuat data pengguna dari database...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-surface-container-low/60 transition-colors group">
                      <td className="py-3.5 px-4 text-center text-on-surface-variant font-label-md">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-title-sm text-title-sm shrink-0 ${u.role.toLowerCase() === 'admin' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-container text-on-secondary-fixed'}`}>
                            {getInitials(u.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-title-sm text-title-sm text-on-surface truncate">{u.name}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{u.subtitle || (u.role.toLowerCase() === 'admin' ? 'Admin Sistem' : 'Kasir Toko')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-on-surface">{u.username}</td>
                      <td className="py-3.5 px-4">
                        {u.role.toLowerCase() === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold border border-primary-fixed-dim">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm font-semibold border border-tertiary-container/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Kasir
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.status ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-medium border border-tertiary-fixed-dim">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm font-medium border border-outline-variant">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-body-sm text-body-sm">
                        {formatLastLogin(u.lastActive)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleOpenInfo(u)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer" 
                            title="Detail Informasi" 
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">info</span>
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer" 
                            title="Edit Pengguna" 
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleOpenDelete(u)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors cursor-pointer" 
                            title="Hapus Pengguna" 
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-2">
                          <span className="material-symbols-outlined text-[32px]">person_search</span>
                        </div>
                        <h3 className="font-title-md text-title-md text-on-surface">Data Tidak Ditemukan</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1">
                          Tidak ada staf yang sesuai dengan kata kunci pencarian atau filter yang dipilih.
                        </p>
                        <button 
                          onClick={() => { setSearchQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}
                          className="mt-4 px-4 py-2 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer" 
                          type="button"
                        >
                          Bersihkan Filter
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Menampilkan <strong className="text-on-surface font-semibold">{filteredUsers.length}</strong> dari <strong className="text-on-surface font-semibold">{users.length}</strong> total pengguna
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-outline opacity-40 cursor-not-allowed" disabled type="button">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="px-2.5 py-1 rounded-md bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">1</span>
              <button className="p-1 rounded text-outline opacity-40 cursor-not-allowed" disabled type="button">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Permissions Explanatory Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="bg-surface-container-low rounded-xl p-4 flex gap-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm text-on-surface">Hak Akses Role Admin</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Diberikan kepada pemilik atau manajer toko. Berhak mengelola master data produk, laporan omset laba-rugi, pembukuan kas, serta menambahkan atau menghapus akun pengguna kasir.
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 flex gap-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-title-sm text-on-surface">Hak Akses Role Kasir</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Dirancang ramah fokus operasional checkout. Hanya memiliki wewenang membuka register kas, memproses transaksi penjualan, cetak struk nota, dan melihat ringkasan shift kasir.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL INFORMATION CARD PENGGUNA */}
      {isInfoModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-primary">badge</span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Kartu Informasi Pengguna</h3>
              </div>
              <button 
                onClick={() => setIsInfoModalOpen(false)} 
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" 
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 flex flex-col gap-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-slate-200">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-title-lg text-title-lg shrink-0 ${selectedUser.role.toLowerCase() === 'admin' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-container text-on-secondary-fixed'}`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold truncate">{selectedUser.name}</h4>
                  <span className="font-label-md text-label-md text-on-surface-variant truncate">
                    {selectedUser.subtitle || (selectedUser.role.toLowerCase() === 'admin' ? 'Admin Sistem' : 'Kasir Toko')}
                  </span>
                  <div className="mt-1">
                    {selectedUser.status ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-medium border border-tertiary-fixed-dim">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm font-medium border border-outline-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Nonaktif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Items */}
              <div className="grid grid-cols-1 gap-3.5 font-body-sm text-body-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-slate-100">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">account_circle</span>
                    Username
                  </span>
                  <span className="font-mono font-medium text-on-surface">{selectedUser.username}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-slate-100">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    Role Akses
                  </span>
                  <span className="capitalize font-medium text-on-surface">{selectedUser.role}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest border border-slate-100">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Terakhir Login
                  </span>
                  <span className="font-medium text-on-surface">{formatLastLogin(selectedUser.lastActive)}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsInfoModalOpen(false)} 
                  className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-lg text-label-lg shadow-sm transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PENGGUNA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{isEditMode ? 'manage_accounts' : 'person_add'}</span>
                </div>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Konfigurasi akun staf dan otoritas akses sistem</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-medium">Nama Lengkap <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Admin Valle" 
                  className="h-10 px-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-medium">Username <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  required 
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="contoh: valle" 
                  className="h-10 px-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant">Digunakan saat proses login ke aplikasi Groseria</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Password {!isEditMode && <span className="text-error">*</span>}</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required={!isEditMode}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={isEditMode ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'} 
                      className="w-full h-10 pl-3 pr-10 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                      <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium">Konfirmasi Password {!isEditMode && <span className="text-error">*</span>}</label>
                  <input 
                    type="password" 
                    required={!isEditMode && formData.password !== ''}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Ulangi password" 
                    className="h-10 px-3 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">Role &amp; Hak Akses <span className="text-error">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none ${formData.role === 'admin' ? 'border-primary bg-primary-container/5' : 'border-slate-200 bg-surface-container-low'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <span className="font-title-sm text-title-sm text-on-surface">Admin</span>
                      </div>
                      <input type="radio" name="user_role" checked={formData.role === 'admin'} onChange={() => setFormData({ ...formData, role: 'admin' })} className="text-primary" />
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Akses penuh: Dashboard, Produk, Laporan, Pengaturan</p>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none ${formData.role === 'kasir' ? 'border-tertiary bg-tertiary-container/5' : 'border-slate-200 bg-surface-container-low'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                        <span className="font-title-sm text-title-sm text-on-surface">Kasir</span>
                      </div>
                      <input type="radio" name="user_role" checked={formData.role === 'kasir'} onChange={() => setFormData({ ...formData, role: 'kasir' })} className="text-primary" />
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Akses operasional kasir: Penjualan &amp; Cetak Struk</p>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="h-10 px-6 rounded-lg bg-primary text-on-primary hover:opacity-90 font-label-lg text-label-lg shadow-sm transition-colors cursor-pointer">
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PENGGUNA */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">delete_forever</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Konfirmasi Hapus</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Apakah Anda yakin ingin menghapus akun ini?
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }} 
                  className="flex-1 h-10 px-4 rounded-lg border border-slate-200 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer"
                >
                  Tidak
                </button>
                <button 
                  type="button" 
                  onClick={confirmDelete} 
                  className="flex-1 h-10 px-4 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-label-lg text-label-lg shadow-sm transition-colors cursor-pointer"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-50 bg-tertiary text-on-tertiary px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transform transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[22px]">{toast.isError ? 'error' : 'check_circle'}</span>
        <div className="flex flex-col">
          <span className="font-title-sm text-title-sm">{toast.title}</span>
          <span className="font-body-sm text-body-sm text-on-tertiary-container">{toast.message}</span>
        </div>
      </div>
    </main>
  );
}