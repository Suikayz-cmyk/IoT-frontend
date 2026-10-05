import { test, expect } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Form SPJ', async ({ page }) => {
  // --- LOGIN DULU ---
  await page.goto('/login');
  
  // Ganti email dan password ini dengan kredensial yang valid di lokal Anda!
  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();

  // Tunggu hingga login berhasil dan berpindah halaman (misal ke dashboard)
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU FORM ADD SPJ ---
  await page.goto('/spj/add');
  await page.waitForTimeout(2000); 

  // Pilih Instansi (akan otomatis mengisi PIC, Alamat, dll)
  const instansiSelect = page.locator('label').filter({ hasText: /^Nama Instansi Pemesan/ }).locator('..').locator('select');
  await instansiSelect.selectOption({ index: 1 });
  await page.waitForTimeout(1000); // Tunggu autofill berjalan

  const fakeDate = faker.date.recent().toISOString().split('T')[0];
  
  // Tanggal
  await page.locator('label').filter({ hasText: /^Tanggal Print/ }).locator('..').locator('input').fill(fakeDate);
  await page.locator('label').filter({ hasText: /^Tanggal Update List/ }).locator('..').locator('input').fill(fakeDate);
  await page.locator('label').filter({ hasText: /^Tanggal Tanda Tangan/ }).locator('..').locator('input').fill(fakeDate);
  await page.locator('label').filter({ hasText: /^Tanggal Pengiriman SPJ/ }).locator('..').locator('input').fill(fakeDate);
  await page.locator('label').filter({ hasText: /^Tanggal Paraf/ }).locator('..').locator('input').fill(fakeDate);

  // Kebutuhan SPJ
  await page.locator('label').filter({ hasText: /^Kebutuhan SPJ/ }).locator('..').locator('textarea').fill(faker.lorem.sentence());

  // Dropdowns
  await page.locator('label').filter({ hasText: /^Jumlah Rangkap/ }).locator('..').locator('select').selectOption('2');
  await page.locator('label').filter({ hasText: /^Jenis Kertas/ }).locator('..').locator('select').selectOption('A4');
  await page.locator('label').filter({ hasText: /^Jenis File/ }).locator('..').locator('select').selectOption('PDF');

  // PIC Print
  await page.locator('label').filter({ hasText: /^PIC Print/ }).locator('..').locator('input').fill(faker.person.fullName());

  // Klik tombol Lanjut / Simpan (di-comment untuk preview)
  await page.getByRole('button', { name: /Lanjut \/ Simpan/i }).click();
  
  await page.waitForTimeout(5000);
});
