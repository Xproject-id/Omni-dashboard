# Supabase Setup Guide for Omni Dashboard

Panduan langkah demi langkah untuk menyiapkan Supabase sebagai database backend.

---

## 1. Buat Akun dan Project Supabase

1. Buka [https://supabase.com](https://supabase.com) dan klik **Start your project**.
2. Login menggunakan akun GitHub atau email.
3. Klik **New Project**.
4. Isi informasi berikut:
   - **Name**: `omni-dashboard` (atau nama lain yang Anda suka)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih region terdekat (misalnya Singapore)
5. Klik **Create new project** dan tunggu beberapa saat hingga selesai.

---

## 2. Dapatkan URL dan Anon Key

1. Di halaman project, buka menu **Settings** > **API**.
2. Salin nilai berikut:
   - **Project URL** → ini adalah `SUPABASE_URL`
   - **anon / public key** → ini adalah `SUPABASE_KEY`
3. Buat file `.env` di root project Anda:

```env
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 3. Jalankan SQL untuk Membuat Tabel

1. Di dashboard Supabase, buka menu **SQL Editor**.
2. Klik **New query** dan paste SQL berikut, lalu klik **Run**:

```sql
-- ============================================
-- OMNI DASHBOARD - DATABASE SCHEMA
-- ============================================

-- Table: platforms
-- Menyimpan data platform marketplace
CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  icon VARCHAR(50)
);

-- Insert default platforms
INSERT INTO platforms (name, color, icon) VALUES
  ('Tokopedia', '#42B549', 'shopping-bag'),
  ('Shopee', '#EE4D2D', 'store'),
  ('TikTok Shop', '#010101', 'video');

-- Table: products
-- Menyimpan data produk dan stok
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  stock INT DEFAULT 0 CHECK (stock >= 0),
  price NUMERIC(12, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: sales
-- Menyimpan data transaksi penjualan
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(12, 2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_platform_id ON sales(platform_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_products_sku ON products(sku);

-- ============================================
-- FUNCTION: Auto-update updated_at on products
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- Enable if you want to restrict access
-- ============================================
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow all for anon" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all for anon" ON sales FOR ALL USING (true);
-- CREATE POLICY "Allow all for anon" ON platforms FOR ALL USING (true);
```

3. Pastikan query berjalan tanpa error.

---

## 4. (Opsional) Masukkan Data Sample

Jalankan query berikut untuk menambahkan data sampel:

```sql
-- Sample Products
INSERT INTO products (name, sku, stock, price) VALUES
  ('Kaos Polos Hitam', 'KPH-001', 150, 89000),
  ('Celana Jogger Abu', 'CJA-002', 80, 159000),
  ('Topi Snapback Navy', 'TSN-003', 200, 65000),
  ('Hoodie Oversize Cream', 'HOC-004', 45, 249000),
  ('Tas Selempang Mini', 'TSM-005', 120, 129000);

-- Sample Sales
INSERT INTO sales (product_id, platform_id, quantity, total_price, sale_date)
SELECT
  p.id,
  pl.id,
  FLOOR(RANDOM() * 10 + 1)::INT,
  p.price * FLOOR(RANDOM() * 10 + 1)::INT,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM products p
CROSS JOIN platforms pl;
```

---

## 5. Verifikasi

1. Buka menu **Table Editor** di Supabase.
2. Pastikan tabel `platforms`, `products`, dan `sales` sudah muncul.
3. Jalankan `npm run dev` pada project dan pastikan data tampil di dashboard.

---

## 6. Konfigurasi Auth (Login & Register) di Supabase

Untuk mengaktifkan fitur login dan registrasi, ikuti langkah berikut:

1. Buka dashboard Supabase.
2. Masuk ke menu **Authentication** (ikon gembok di sebelah kiri).
3. Pilih tab **Providers** di bawah menu **Configuration**.
4. Klik **Email** dan pastikan **Enable Email provider** aktif.
5. Pastikan opsi **Confirm email** **DINONAKTIFKAN (Toggled Off)** untuk percobaan awal, agar pengguna bisa langsung login tanpa perlu verifikasi email (opsional: aktifkan nanti jika aplikasi akan live).
6. Di bagian bawah menu Authentication, buka **URL Configuration** dan pastikan **Site URL** mengarah ke `http://localhost:3000`.

---

Selesai! Dashboard Anda sekarang sudah terhubung dengan Supabase dan fitur Login Auth sudah siap digunakan. 🎉
