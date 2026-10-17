const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pengguna.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin Groseria',
      subtitle: 'Admin Sistem',
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN',
      status: false,
    },
  });

  await prisma.pengguna.upsert({
    where: { username: 'kasir' },
    update: {},
    create: {
      name: 'Kasir Groseria',
      subtitle: 'Kasir Toko',
      username: 'kasir',
      password: 'kasir123',
      role: 'KASIR',
      status: false,
    },
  });

// 2. Seed 10 Data Produk Awal (Gambar NULL)
  const initialProducts = [
    { code: 'PRD001', name: 'Indomie Goreng Special', sku: '899886620011', category: 'Makanan', buyPrice: 2800, nettPrice: 3500, stock: 150, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD002', name: 'Aqua Botol 600ml', sku: '888600810109', category: 'Minuman', buyPrice: 3000, nettPrice: 4000, stock: 7, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD003', name: 'Gula Pasir Gulaku 1kg', sku: '899317511019', category: 'Sembako', buyPrice: 12000, nettPrice: 14000, stock: 3, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD004', name: 'Beras Sania Premium 5kg', sku: '899123456001', category: 'Sembako', buyPrice: 65000, nettPrice: 72000, stock: 25, unit: 'sak', updatedBy: 'Admin' },
    { code: 'PRD005', name: 'Minyak Goreng Bimoli 2L', sku: '899123456002', category: 'Sembako', buyPrice: 32000, nettPrice: 35000, stock: 45, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD006', name: 'Telur Ayam Negeri 1kg', sku: '899123456003', category: 'Sembako', buyPrice: 24000, nettPrice: 28000, stock: 12, unit: 'kg', updatedBy: 'Admin' },
    { code: 'PRD007', name: 'Kecap Manis Bango 520ml', sku: '899123456004', category: 'Sembako', buyPrice: 20000, nettPrice: 23500, stock: 8, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD008', name: 'Susu UHT Ultra Milk 1L', sku: '899123456005', category: 'Minuman', buyPrice: 15000, nettPrice: 18000, stock: 30, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD009', name: 'Sabun Mandi Lifebuoy 110g', sku: '899123456006', category: 'Kebutuhan RT', buyPrice: 3500, nettPrice: 4500, stock: 60, unit: 'pcs', updatedBy: 'Admin' },
    { code: 'PRD010', name: 'Kopi Kapal Api 165g', sku: '899123456007', category: 'Minuman', buyPrice: 11000, nettPrice: 13500, stock: 2, unit: 'pcs', updatedBy: 'Admin' },
  ];

  for (const product of initialProducts) {
    await prisma.produk.upsert({
      where: { code: product.code },
      update: {},
      create: product,
    });
  }

  console.log('Berhasil menambahkan akun default dan 10 data produk awal ke database!');

  const defaultSettings = [
    { key: 'store_name', value: 'Groseria' },
    { key: 'store_address', value: 'BSD City, Tangerang Selatan' },
    { key: 'tax_percentage', value: '5' },
    { key: 'payment_cash', value: 'true' },
    { key: 'payment_qris', value: 'true' }
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }

  console.log('Berhasil menambahkan data awal tabel setting!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });