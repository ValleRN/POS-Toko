import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // State Error Validasi
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // State Feedback / Loading
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
    }

    if (!password.trim()) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (isValid) {
      // Cek Kredensial Sementara
      const cleanUsername = username.trim().toLowerCase();
      const cleanPassword = password.trim();

      if ((cleanUsername === 'admin' && cleanPassword === 'admin123') || (cleanUsername === 'kasir' && cleanPassword === 'kasir123')) {
        setIsLoading(true);
        setFeedback({ show: false, message: '', type: 'success' });

        const role = cleanUsername === 'admin' ? 'admin' : 'kasir';
        const roleName = role === 'admin' ? 'Admin (dashboard.js)' : 'Kasir (dashboard-kasir.js)';

        setTimeout(() => {
          setIsLoading(false);
          setFeedback({
            show: true,
            message: `Autentikasi Berhasil! Mengalihkan ke ${roleName}...`,
            type: 'success'
          });

          // Panggil callback transisi halaman jika disediakan oleh parent router
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess(role);
            }
          }, 800);
        }, 1000);
      } else {
        // Jika salah
        setFeedback({
          show: true,
          message: 'Username atau password salah! Gunakan admin/admin123 atau kasir/kasir123.',
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center m-0 p-4 antialiased selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Background Layer dengan Radial Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, rgb(37, 99, 235) 0%, rgb(30, 64, 175) 18%, rgb(15, 23, 42) 48%, rgb(2, 6, 23) 80%, rgb(0, 0, 0) 100%)' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35)_0%,transparent_65%)]"></div>
      </div>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100/90 p-6 sm:p-7 transition-all duration-300">
          
          {/* Card Header */}
          <header className="text-center mb-5">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-sm shrink-0 mb-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a3.75 3.75 0 0 0 3.498-2.48l2.085-5.706a.75.75 0 0 0-.704-1.014H6.615l-.17-1.148A1.875 1.875 0 0 0 4.636 2.25H2.25ZM7.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM18.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
            </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">POS Toko</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Sistem Kasir &amp; Manajemen Retail</p>
            
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Versi 2.4 — Online System</span>
            </div>
          </header>

          {/* Dynamic Feedback Alert */}
          {feedback.show && (
            <div className={`mb-4 p-3 rounded-lg text-xs font-medium border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`} role="alert">
              {feedback.message}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="usernameInput">
                Username atau Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <input 
                  autoComplete="username" 
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${usernameError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'}`} 
                  id="usernameInput" 
                  name="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau kasir" 
                  type="text" 
                />
              </div>
              {usernameError && <p className="text-xs text-rose-600 mt-1 font-medium">Username tidak boleh kosong.</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="passwordInput">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <input 
                  autoComplete="current-password" 
                  className={`w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50/50 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${passwordError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'}`} 
                  id="passwordInput" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123 atau kasir123" 
                  type={showPassword ? 'text' : 'password'} 
                />
                
                {/* Password Toggle */}
                <button 
                  aria-label="Tampilkan atau sembunyikan password" 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="text-xs text-rose-600 mt-1 font-medium">Password tidak boleh kosong.</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  type="checkbox" 
                />
                <span className="text-xs text-slate-600 font-medium">Ingat saya di perangkat ini</span>
              </label>
              <a className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors" href="#lupa-password">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-1.5">
              <button 
                disabled={isLoading}
                className={`w-full py-2.5 px-4 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 focus:ring-4 focus:ring-blue-100 cursor-pointer ${feedback.type === 'success' && feedback.show ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`} 
                type="submit"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>MEMVERIFIKASI...</span>
                  </>
                ) : feedback.type === 'success' && feedback.show ? (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>BERHASIL MASUK</span>
                  </>
                ) : (
                  <>
                    <span>MASUK KE SISTEM</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Card Footer */}
          <footer className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Dilindungi enkripsi SSL 256-bit</span>
            </div>
            <div>
              <a className="text-xs text-slate-500 hover:text-blue-600 transition-colors" href="#support">
                Butuh bantuan? <span className="underline font-medium">Hubungi IT Support Toko</span>
              </a>
            </div>
          </footer>

        </div>
      </main>

    </div>
  );
}