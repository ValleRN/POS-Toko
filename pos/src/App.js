import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import DashboardKasir from './components/kasir/dashboard-kasir'; 
import RiwayatTransaksi from './components/kasir/transaksi-kasir';
import Transaksi from './components/transaksi';
import Produk from './components/produk';
import Laporan from './components/laporan';
import Pengguna from './components/pengguna';
import Pengaturan from './components/pengaturan';
import Login from './components/login';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Inisialisasi state halaman aktif dari localStorage agar tetap bertahan saat di-refresh
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('groseria_active_page') || 'dashboard';
  });

  const [kasirPage, setKasirPage] = useState(() => {
    return localStorage.getItem('groseria_kasir_page') || 'terminal';
  });

  const [transactions, setTransactions] = useState([]);

  // 2. Simpan posisi halaman aktif ke localStorage tiap kali berpindah menu
  useEffect(() => {
    localStorage.setItem('groseria_active_page', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('groseria_kasir_page', kasirPage);
  }, [kasirPage]);

  // Cek sesi login tersimpan
  useEffect(() => {
    const savedUser = localStorage.getItem('groseria_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('groseria_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Heartbeat Ping ke backend setiap 45 detik
  useEffect(() => {
    if (!user?.id) return;

    const sendPing = async () => {
      try {
        await fetch('http://localhost:5000/api/users/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
      } catch (err) {
        console.error('Ping error:', err);
      }
    };

    sendPing();
    const interval = setInterval(sendPing, 45 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLoginSuccess = (userData) => {
    const formattedUser = typeof userData === 'string' 
      ? { 
          id: userData === 'admin' ? 1 : 2, 
          role: userData, 
          username: userData, 
          name: userData === 'admin' ? 'Admin Groseria' : 'Kasir Groseria',
          subtitle: userData === 'admin' ? 'Super Admin' : 'Kasir'
        }
      : userData;

    setUser(formattedUser);
    localStorage.setItem('groseria_user', JSON.stringify(formattedUser));
  };

  const handleLogout = async () => {
    if (user?.id) {
      try {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    // Hapus sesi user dan simpanan posisi halaman saat logout
    localStorage.removeItem('groseria_user');
    localStorage.removeItem('groseria_active_page');
    localStorage.removeItem('groseria_kasir_page');
    setUser(null);
    setActivePage('dashboard');
    setKasirPage('terminal');
  };

  const handleSaveTransaction = (newTrx) => {
    setTransactions((prev) => [newTrx, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        Memuat sistem Groseria...
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role === 'kasir') {
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

  return (
    <div className="antialiased min-h-screen bg-[#f8f9ff]">
      
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />

      <div className="pl-64">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-slate-900">Groseria</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">{user?.name || 'Admin Groseria'}</div>
                <div className="text-xs text-slate-500">{user?.subtitle || (user?.role === 'admin' ? 'Super Admin' : 'Kasir')}</div>
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