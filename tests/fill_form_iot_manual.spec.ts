import { test, expect } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Form IoT Manual', async ({ page }) => {
  test.setTimeout(120000);

  // --- LOGIN ---
  await page.goto('/login');
  
  page.on('dialog', async (dialog) => {
    console.log('🚨 MUNCUL ALERT DARI BROWSER:', dialog.message());
    await dialog.accept();
  });

  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();

  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU FORM ADD ---
  await page.goto('/pemesanan/add');
  await page.waitForTimeout(2000); 

  // Pilih Kategori IoT Manual
  await page.locator('select[name="kategori"]').selectOption('IoT Manual');
  await page.waitForTimeout(500);
  
  // Isi Kode Pemesanan
  await page.locator('input[name="kodePemesanan"]').fill(faker.string.alphanumeric(8).toUpperCase());

  // Pilih Instansi (akan otomatis mengisi PIC, NIK, dll)
  const instansiSelect = page.locator('select[name="instansi"]');
  await instansiSelect.selectOption({ index: 1 }); 
  await page.waitForTimeout(1000); 

  // === Detail IoT (isIoT) ===
  await page.locator('input[name="quantity"]').fill(faker.number.int({ min: 1, max: 50 }).toString());
  await page.locator('select[name="periodeBerlangganan"]').selectOption('1 Tahun');
  await page.locator('input[name="hargaPPN"]').fill(faker.number.int({ min: 500000, max: 2000000 }).toString());
  
  // === Detail IoT Manual ===
  await page.locator('select[name="bulanPengirimanSPH"]').selectOption('Januari');
  await page.locator('input[name="nomorSuratPenawaranHarga"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="nomorKontrakBerlangganan"]').fill(faker.string.alphanumeric(12).toUpperCase());
  await page.locator('input[name="nomorFormulirBerlangganan"]').fill(faker.string.alphanumeric(10).toUpperCase());

  // === Status ===
  await page.locator('select[name="statusPesanan"]').selectOption('baru');
  await page.locator('select[name="statusOdoo"]').selectOption('draft');
  
  // === Detail Purchase Order ===
  const fakeDate = faker.date.recent().toISOString().split('T')[0];
  await page.locator('input[name="tanggalPesananPO"]').fill(fakeDate);
  await page.locator('input[name="tanggalBAST"]').fill(fakeDate);
  await page.locator('input[name="nomorBAST"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="nomorInvoiceKUT"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="tanggalInvoiceKUT"]').fill(fakeDate);
  await page.locator('input[name="nsfp"]').fill(faker.string.numeric(16));
  await page.locator('input[name="tanggalUangMasuk"]').fill(fakeDate);
  await page.locator('input[name="jumlahUangMasuk"]').fill(faker.number.int({ min: 1000000, max: 10000000 }).toString());
  await page.locator('input[name="rekeningPenerima"]').fill(faker.string.numeric(10));
  await page.locator('textarea[name="keterangan"]').fill(faker.lorem.sentence());

  // --- SIMPAN ---
  await page.getByRole('button', { name: /lanjut \/ simpan/i }).click();

  await page.waitForTimeout(5000);
});
