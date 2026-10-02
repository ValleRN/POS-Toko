import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import DashboardKasir from './components/kasir/dashboard-kasir'; 
import RiwayatTransaksi from './components/kasir/transaksi-kasir'; // Import halaman riwayat transaksi kasir
import Transaksi from './components/transaksi';
import Produk from './components/produk';
import Laporan from './components/laporan';
import Pengguna from './components/pengguna';
import Pengaturan from './components/pengaturan';
import Login from './components/login';

function App() {
  // State untuk melacak apakah user sudah login ('admin', 'kasir', atau null jika belum login)
  const [userRole, setUserRole] = useState(null);

  // State untuk halaman aktif di dalam dashboard admin
  const [activePage, setActivePage] = useState('dashboard');

  // State khusus untuk navigasi halaman kasir ('terminal' atau 'riwayat')
  const [kasirPage, setKasirPage] = useState('terminal');

  // State untuk menyimpan daftar riwayat transaksi kasir secara global
  const [transactions, setTransactions] = useState([]);

  // Handler ketika berhasil login dari form login
  const handleLoginSuccess = (role) => {
    setUserRole(role); // role bisa bernilai 'admin' atau 'kasir'
    setActivePage('dashboard');
    setKasirPage('terminal');
  };

  // Handler ketika tombol logout ditekan
  const handleLogout = () => {
    setUserRole(null); // Kembali ke halaman login
    setKasirPage('terminal');
  };

  // Handler untuk menyimpan transaksi baru dari terminal kasir ke riwayat
  const handleSaveTransaction = (newTrx) => {
    setTransactions((prev) => [newTrx, ...prev]);
  };

  // 1. Jika belum login, tampilkan halaman Login
  if (!userRole) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Jika role adalah KASIR, kelola navigasi antara Terminal Kasir dan Riwayat Transaksi
  if (userRole === 'kasir') {
    if (kasirPage === 'riwayat') {
      return (
        <RiwayatTransaksi 
          transactions={transactions} 
          onNavigateTerminal={() => setKasirPage('terminal')} 
        />
      );
    }
    return (
      <DashboardKasir 
        onLogout={handleLogout} 
        onSaveTransaction={handleSaveTransaction}
        onNavigateRiwayat={() => setKasirPage('riwayat')}
      />
    );
  }

  // 3. Jika role adalah ADMIN, tampilkan sistem utama dengan Sidebar & Router Page
  return (
    <div className="antialiased min-h-screen bg-[#f8f9ff]">
      
      {/* Sidebar menerima callback onLogout untuk konfirmasi & kembali ke login */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />

      <div className="pl-64">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-900">POS Toko</span>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium">Toko Buka</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">Admin Toko</div>
                <div className="text-xs text-slate-500">Super Admin</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Router Halaman Admin */}
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'transaksi' && <Transaksi />}
        {activePage === 'produk' && <Produk />}
        {activePage === 'laporan' && <Laporan />}
        {activePage === 'pengguna' && <Pengguna />}
        {activePage === 'pengaturan' && <Pengaturan />}
      </div>

    </div>
  );
}

export default App;