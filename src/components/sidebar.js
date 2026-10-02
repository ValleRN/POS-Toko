import React, { useState } from 'react';

const Sidebar = ({ activePage, setActivePage, onLogout }) => {
  // State untuk modal konfirmasi logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Daftar menu agar lebih rapi
  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'transaksi', icon: 'receipt_long', label: 'Transaksi' },
    { id: 'produk', icon: 'inventory_2', label: 'Produk' },
    { id: 'laporan', icon: 'summarize', label: 'Laporan' },
    { id: 'pengguna', icon: 'group', label: 'Pengguna' },
    { id: 'pengaturan', icon: 'settings', label: 'Pengaturan' },
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true); // Membuka konfirmasi pertama / utama
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout(); // Fungsi untuk mengubah state navigasi ke halaman login.js
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-slate-200 border-r border-slate-800 z-50 flex flex-col justify-between select-none">
        <div className="flex flex-col h-full">
          
          {/* Logo & Brand (Rata Kiri) */}
          <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-white font-semibold tracking-tight leading-none text-base">POS Toko</span>
              <span className="text-slate-400 text-xs mt-1">Retail Management</span>
            </div>
          </div>

          {/* Menu Navigation */}
          <div className="flex-1 overflow-y-auto py-2 px-3">
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 px-2 py-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                <span>Admin</span>
              </div>
              
              {/* Looping Menu Dinamis */}
              {menuItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm cursor-pointer ${
                      isActive
                        ? 'bg-[#004ac6] text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}

            </nav>
          </div>

          {/* Logout Trigger */}
          <div className="p-3 border-t border-slate-800">
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MODAL DOUBLE CONFIRMATION LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                <span className="material-symbols-outlined text-[26px]">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Konfirmasi Keluar</h3>
                <p className="text-xs text-slate-400">Sesi aktif kasir akan diakhiri.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Apakah Anda benar-benar yakin ingin keluar dari sistem POS Toko? Anda harus memasukkan ulang kredensial untuk masuk kembali.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                type="button"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Ya, Keluar</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;