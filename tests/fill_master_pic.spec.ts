import { test } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Master PIC', async ({ page }) => {
  test.setTimeout(120000); // 2 menit

  // --- LOGIN ---
  await page.goto('/login');
  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();

  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU MASTER DATA ---
  await page.goto('/master-data');
  await page.waitForTimeout(1000); 

  // Pindah ke tab PIC
  await page.getByRole('button', { name: /master pic/i }).click();
  await page.waitForTimeout(500);

  // LOOP 15 KALI
  const TOTAL_DATA = 15;
  for (let i = 0; i < TOTAL_DATA; i++) {
    console.log("Mengisi PIC ke-" + (i + 1));

    await page.getByRole('button', { name: /tambah pic/i }).click();
    await page.waitForTimeout(500);

    // Memilih instansi secara berurutan mulai dari index 1 (karena index 0 adalah 'Pilih Instansi')
    // Jika data instansi di DB Anda lebih sedikit dari i+1, ini bisa error. Pastikan jumlah instansi cukup!
    await page.locator('select').selectOption({ index: i + 1 });

    await page.getByPlaceholder('Nama PIC').fill(faker.person.fullName());
    await page.getByPlaceholder('NIK').fill(faker.string.numeric(16));
    await page.getByPlaceholder('Email').fill(faker.internet.email().toLowerCase());
    
    // Nomor Telepon 
    await page.getByPlaceholder('Nomor Telepon').fill(faker.phone.number('08##########'));

    // --- SIMPAN ---
    await page.getByRole('button', { name: /simpan/i }).click();
    
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(4000);
});
