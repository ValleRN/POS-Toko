# APLIKASI POINT OF SALES (POS) - TOKO

Aplikasi Point of Sales (POS) berbasis web untuk mengelola transaksi penjualan, data produk, stok, dan laporan toko. Proyek ini memiliki dua role pengguna yaitu **Admin** dan **Kasir**.

---

## 🔑 Contoh Akun Login (Demo)

Gunakan kredensial berikut untuk masuk ke dalam aplikasi sesuai dengan rolenya masing-masing:

* **Admin**
  * Username: `admin`
  * Password: `admin123`

* **Kasir**
  * Username: `kasir`
  * Password: `kasir123`

---

## 🎨 Tautan Desain UI/UX
* [Figma UI/UX Design - Aplikasi POS](https://www.figma.com/design/KKI27Cf1VGj8yXBKoIL9vn/UI-UX-Aplikasi-POS?m=auto&t=UZwkqnCP5OzgcFZU-6)

---

## 1. Hirarki Menu Sidebar/Navbar

Aplikasi POS memiliki dua role pengguna, yaitu **Admin** dan **Kasir**.

### Struktur Menu

```text
POS TOKO
│
├── Login
│
├── Admin
│   ├── Dashboard
│   ├── Transaksi
│   │   └── Riwayat Transaksi
│   ├── Produk
│   │   ├── Tambah Produk
│   │   ├── Edit Produk
│   │   └── Tambah Stok
│   ├── Laporan
│   ├── Pengguna
│   └── Pengaturan
│
└── Kasir
    ├── Kasir / Transaksi
    └── Riwayat Transaksi
