const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// ==========================================
// ENDPOINT PENGATURAN TOKO (SETTINGS)
// ==========================================

// GET: Ambil Semua Pengaturan Toko
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Ubah format dari array [{key, value}] ke object { tax_percentage: "5", payment_cash: "true", ... }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // Kembalikan object respons dengan default values
    res.json({
      status: 'success',
      data: {
        tax_percentage: Number(settingsObj.tax_percentage || 5),
        payment_cash: settingsObj.payment_cash !== 'false',
        payment_qris: settingsObj.payment_qris !== 'false',
        store_name: settingsObj.store_name || 'Groseria',
        store_address: settingsObj.store_address || 'BSD City, Tangerang Selatan'
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ status: 'error', message: 'Gagal mengambil pengaturan' });
  }
});

// POST: Simpan / Update Pengaturan Toko
app.post('/api/settings', async (req, res) => {
  const settingsData = req.body;

  try {
    // Memproses setiap key-value secara aman
    const updates = Object.entries(settingsData).map(([key, value]) => {
      let stringValue = String(value);
      
      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue }
      });
    });

    await prisma.$transaction(updates);
    
    // Kirim respons sukses yang terstruktur
    return res.json({ 
      status: 'success', 
      message: 'Pengaturan berhasil diperbarui' 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menyimpan pengaturan' 
    });
  }
});

// ==========================================
// 2. ENDPOINT PENGGUNA & AKUN STAF
// ==========================================

// GET: Ambil Semua Pengguna dari DB
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.pengguna.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna' });
  }
});

// POST: Tambah Pengguna Baru (Default status = false / offline)
app.post('/api/users', async (req, res) => {
  const { name, subtitle, username, password, role } = req.body;
  const userRole = role ? role.toLowerCase() : 'kasir';

  try {
    const newUser = await prisma.pengguna.create({
      data: {
        name,
        subtitle: subtitle || (userRole === 'admin' ? 'Admin Sistem' : 'Kasir Toko'),
        username: username.toLowerCase().trim(),
        password,
        role: userRole.toUpperCase(),
        status: false // Default offline sampai user login pertama kali
      }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username sudah digunakan!' });
    }
    res.status(500).json({ message: 'Gagal menambahkan pengguna' });
  }
});

// PUT: Edit Data Pengguna
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, subtitle, username, password, role } = req.body;

  try {
    const updateData = {
      name,
      username: username.toLowerCase().trim(),
      role: role.toUpperCase()
    };

    if (subtitle) updateData.subtitle = subtitle;
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    const updatedUser = await prisma.pengguna.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui data pengguna' });
  }
});

// DELETE: Hapus Pengguna
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pengguna.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus pengguna' });
  }
});

// ==========================================
// 3. ENDPOINT AUTENTIKASI (LOGIN & LOGOUT)
// ==========================================

// POST: Login (Mengubah status menjadi true & mencatat waktu login)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.pengguna.findUnique({
      where: { username: username.toLowerCase().trim() }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Username atau password salah!' });
    }

    const updatedUser = await prisma.pengguna.update({
      where: { id: user.id },
      data: {
        status: true,
        lastActive: new Date()
      }
    });

    res.json({ message: 'Login berhasil', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// POST: Logout (Mengubah status menjadi false / offline)
app.post('/api/logout', async (req, res) => {
  const { userId } = req.body;

  try {
    if (userId) {
      await prisma.pengguna.update({
        where: { id: Number(userId) },
        data: { status: false }
      });
    }
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal logout' });
  }
});

// POST: Ping Heartbeat
app.post('/api/users/ping', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'User ID diperlukan' });

  try {
    await prisma.pengguna.update({
      where: { id: Number(userId) },
      data: { status: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Gagal ping' });
  }
});

// Auto-Cleanup Heartbeat (Ubah status ke false jika tidak ada ping selama 2 menit)
setInterval(async () => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    await prisma.pengguna.updateMany({
      where: {
        status: true,
        updatedAt: { lt: twoMinutesAgo }
      },
      data: { status: false }
    });
  } catch (error) {
    console.error('[Heartbeat Error]:', error);
  }
}, 60 * 1000);

// ==========================================
// 4. ENDPOINT CRUD PRODUK
// ==========================================

// GET: Ambil Semua Produk
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.produk.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
});

// POST: Tambah Produk Baru
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await prisma.produk.create({
      data: req.body
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') return res.status(400).json({ message: 'Kode Produk sudah digunakan!' });
    res.status(500).json({ message: 'Gagal menambahkan produk' });
  }
});

// PUT: Edit Produk
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.produk.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
});

// DELETE: Hapus Produk
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produk.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
});

// ==========================================
// 5. ENDPOINT TRANSAKSI & RIWAYAT TRANSAKSI
// ==========================================

// POST: Simpan Transaksi Baru & Potong Stok Otomatis
app.post('/api/transactions', async (req, res) => {
  const { invoiceNumber, totalAmount, paymentMethod, userId, items } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat data transaksi utama
      const newTransaction = await tx.transaction.create({
        data: {
          invoiceNumber,
          totalAmount: Number(totalAmount),
          paymentMethod,
          userId: Number(userId) || 1,
        }
      });

      // 2. Simpan detail produk dan kurangi stok produk di database
      for (const item of items) {
        const qtyToDecrement = Number(item.quantity || item.qty);
        const priceAtTrx = Number(item.priceAtTransaction || item.price);

        await tx.transactionDetail.create({
          data: {
            transactionId: newTransaction.id,
            productId: Number(item.productId),
            quantity: qtyToDecrement,
            priceAtTransaction: priceAtTrx
          }
        });

        // Kurangi stok produk berdasarkan qty pembelian
        await tx.produk.update({
          where: { id: Number(item.productId) },
          data: {
            stock: {
              decrement: qtyToDecrement
            }
          }
        });
      }

      return newTransaction;
    });

    res.status(201).json({ message: 'Transaksi berhasil disimpan & stok terpotong', transaction: result });
  } catch (error) {
    console.error('Error saat transaksi:', error);
    res.status(500).json({ message: 'Gagal memproses transaksi di server' });
  }
});

// GET: Ambil Semua Riwayat Transaksi
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, subtitle: true }
        },
        details: {
          include: {
            product: {
              select: { name: true, code: true }
            }
          }
        }
      }
    });

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      invoiceNumber: t.invoiceNumber,
      createdAt: t.createdAt,
      totalAmount: t.totalAmount,
      paymentMethod: t.paymentMethod,
      userName: t.user ? t.user.name : 'Kasir Groseria',
      TransactionItems: t.details.map((d) => ({
        quantity: d.quantity,
        priceAtTransaction: d.priceAtTransaction,
        Product: {
          name: d.product ? d.product.name : 'Produk'
        }
      }))
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error('Error saat mengambil data transaksi:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi' });
  }
});

// ==========================================
// 6. SERVER RUNNER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server backend berjalan di http://localhost:${PORT}`));