import { test, expect } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Form Pemesanan', async ({ page }) => {
  // --- LOGIN DULU ---
  // Arahkan ke halaman login
  await page.goto('/login');
  
  // Ganti email dan password ini dengan kredensial yang valid di lokal Anda!
  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();

  // Tunggu hingga login berhasil dan berpindah halaman (misal ke dashboard)
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU FORM ADD ---
  await page.goto('/pemesanan/add');
  await page.waitForTimeout(2000); 

  await page.locator('select[name="kategori"]').selectOption('Timbangan Inaproc');
  
  // Isi Kode Pemesanan
  await page.locator('input[name="kodePemesanan"]').fill(faker.string.alphanumeric(8).toUpperCase());

  // Pilih Instansi (akan otomatis mengisi PIC, NIK, dll)
  const instansiSelect = page.locator('select[name="instansi"]');
  await instansiSelect.selectOption({ index: 1 });
  await page.waitForTimeout(1000); // Tunggu autofill PIC berjalan

  await page.locator('input[name="nomorBAST"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="nsfp"]').fill(faker.string.numeric(16));
  await page.locator('input[name="nomorInvoiceInaproc"]').fill(faker.string.numeric(8));
  
  const fakeDate = faker.date.recent().toISOString().split('T')[0];
  await page.locator('input[name="tanggalBAST"]').fill(fakeDate);
  await page.locator('input[name="tanggalPesananPO"]').fill(fakeDate);

  await page.locator('input[name="harga"]').fill(faker.number.int({ min: 1000000, max: 5000000 }).toString());
  await page.locator('input[name="ppn11"]').fill(faker.number.int({ min: 110000, max: 550000 }).toString());
  await page.locator('input[name="quantity"]').fill(faker.number.int({ min: 1, max: 10 }).toString());

  await page.locator('select[name="statusPesanan"]').selectOption('baru');
  await page.locator('select[name="statusOdoo"]').selectOption('draft');
  await page.locator('select[name="kodeBayar"]').selectOption('UP');

  await page.locator('select[name="wilayahPengiriman"]').selectOption({ index: 1 });
  await page.locator('select[name="ekspedisi"]').selectOption({ index: 1 });

  await page.locator('input[name="nomorResi"]').fill(faker.string.alphanumeric(15).toUpperCase());
  await page.locator('input[name="berat"]').fill(faker.number.int({ min: 1, max: 50 }).toString());
  
  await page.waitForTimeout(5000);
});
