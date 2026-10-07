import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Form Pemesanan', () => {
  test('Bisa membuka halaman Tambah Pemesanan dan mengetik data', async ({ page }) => {
    // 1. Kunjungi halaman Add (Pastikan frontend sedang berjalan di port 5173!)
    await page.goto('/pemesanan/add');

    // 2. Pastikan judul halaman benar
    await expect(page.getByText('Tambah Pemesanan')).toBeVisible();

    // 3. Generate data acak menggunakan Faker
    const randomKode = faker.string.alphanumeric(8).toUpperCase();
    const randomPO = faker.string.numeric(10);
    const randomNsfp = faker.finance.accountNumber(10);

    // 4. Isi Form Utama (Kategori & Kode)
    await page.selectOption('select[name="kategori"]', 'Timbangan Inaproc');
    await page.fill('input[name="kodePemesanan"]', randomKode);

    // 5. Isi Form Pengadaan (Procurement)
    await page.fill('input[name="nomorPOKUT"]', randomPO);
    await page.fill('input[name="nsfp"]', randomNsfp);

    // Anda bisa melanjutkan script ini untuk mengisi seluruh input menggunakan nama atribut name-nya
    // Contoh: await page.fill('input[name="hargaPPN"]', '1500000');
    // Lalu klik simpan: await page.click('button[type="submit"]');

    // Karena ini hanya simulasi awal, kita tidak melakukan submit agar tidak mengotori database
    console.log(`Berhasil mengetik kode dummy: ${randomKode}`);
  });
});
