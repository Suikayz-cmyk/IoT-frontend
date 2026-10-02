import { test, expect } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Master Instansi', async ({ page }) => {
  test.setTimeout(120000); // Perpanjang batas waktu test hingga 2 menit (jika loop panjang)

  // --- LOGIN DULU ---
  await page.goto('/login');
  
  // Sesuaikan dengan kredensial Anda
  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();

  // Tunggu hingga login berhasil
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU HALAMAN MASTER DATA ---
  await page.goto('/master-data');
  await page.waitForTimeout(1000); 

  // Pastikan berada di tab Instansi
  await page.getByRole('button', { name: /master instansi/i }).click();
  await page.waitForTimeout(500);

  // LOOP SEBANYAK 15 KALI
  const TOTAL_DATA = 15;
  for (let i = 0; i < TOTAL_DATA; i++) {
    console.log("Mengisi data ke-" + (i + 1));

    // Klik tombol Tambah Instansi
    await page.getByRole('button', { name: /tambah instansi/i }).click();
    await page.waitForTimeout(500);

    // --- MENGISI FORM DENGAN FAKER ---
    // Menggunakan format "Puskesmas [Nama Kota/Daerah]"
    const namaKota = faker.location.city();
    await page.getByPlaceholder('Nama Instansi').fill('Puskesmas ' + namaKota);
    
    // NPWP biasanya 15-16 digit angka
    await page.getByPlaceholder('NPWP').fill(faker.string.numeric(16));
    
    await page.getByPlaceholder('Provinsi').fill(faker.location.state());
    await page.getByPlaceholder('Kota/Kabupaten').fill(namaKota);
    
    // Alamat Lengkap
    await page.getByPlaceholder('Alamat Lengkap').fill(faker.location.streetAddress({ useFullAddress: true }));

    // --- SIMPAN ---
    await page.getByRole('button', { name: /simpan/i }).click();
    
    // Tunggu sebentar agar animasi modal tertutup dan request API selesai
    await page.waitForTimeout(1000);
  }

  // Biarkan browser terbuka sebentar di akhir
  await page.waitForTimeout(4000);
});
