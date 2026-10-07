import { test } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Master Wilayah', async ({ page }) => {
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

  // Pindah ke tab Wilayah
  await page.getByRole('button', { name: /master wilayah/i }).click();
  await page.waitForTimeout(500);

  // LOOP 15 KALI
  const TOTAL_DATA = 15;
  for (let i = 0; i < TOTAL_DATA; i++) {
    console.log("Mengisi Wilayah ke-" + (i + 1));

    await page.getByRole('button', { name: /tambah wilayah/i }).click();
    await page.waitForTimeout(500);

    const namaProvinsi = faker.location.state();
    const namaKota = faker.location.city();

    await page.getByPlaceholder('Provinsi').fill(namaProvinsi);
    await page.getByPlaceholder('Kota/Kabupaten').fill(namaKota);
    
    // Alamat lengkap bisa disesuaikan dengan kotanya
    await page.getByPlaceholder('Alamat (Opsional)').fill(faker.location.streetAddress({ useFullAddress: true }));

    // --- SIMPAN ---
    await page.getByRole('button', { name: /simpan/i }).click();
    
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(4000);
});
