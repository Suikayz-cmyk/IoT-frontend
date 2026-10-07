import { test } from '@playwright/test';
import { fakerID_ID as faker } from '@faker-js/faker';

test('Auto-fill Form Timbangan Manual', async ({ page }) => {
  test.setTimeout(120000);

  // --- LOGIN ---
  await page.goto('/login');
  
  page.on('dialog', async (dialog) => {
    console.log('?? MUNCUL ALERT DARI BROWSER:', dialog.message());
    await dialog.accept();
  });

  await page.locator('input[type="email"]').fill('admin@iot.com');
  await page.locator('input[type="password"]').first().fill('password123'); 
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // --- MENUJU FORM ADD ---
  await page.goto('/pemesanan/add');
  await page.waitForTimeout(2000); 

  // Pilih Kategori
  await page.locator('select[name="kategori"]').selectOption('Timbangan Manual');
  await page.waitForTimeout(500);
  
  // Isi Kode Pemesanan
  await page.locator('input[name="kodePemesanan"]').fill(faker.string.alphanumeric(8).toUpperCase());

  // Pilih Instansi (akan otomatis mengisi PIC, NIK, dll)
  const instansiInput = page.locator('label').filter({ hasText: /^Nama Instansi Pemesan/ }).locator('..').locator('input[type="text"]');
  await instansiInput.click();
  await page.waitForTimeout(500);
  await page.locator('.absolute.top-full .cursor-pointer').first().click(); 
  await page.waitForTimeout(1000); 

  // === Detail Kategori (isTimbangan) ===
  await page.locator('input[name="quantity"]').fill(faker.number.int({ min: 1, max: 10 }).toString());
  await page.locator('select[name="tipeTimbangan"]').selectOption('Sonic Opsi A');
  await page.locator('input[name="nomorPenyampaianDaftarHarga"]').fill(faker.string.alphanumeric(8).toUpperCase());
  await page.locator('input[name="nomorFormulirPembelian"]').fill(faker.string.alphanumeric(8).toUpperCase());
  
  await page.locator('select[name="wilayahPengiriman"]').selectOption({ index: 1 });
  await page.locator('select[name="berat"]').selectOption('1');
  await page.locator('select[name="ekspedisi"]').selectOption({ index: 1 });
  await page.locator('input[name="nomorResi"]').fill(faker.string.alphanumeric(15).toUpperCase());
  
  const fakeDate = faker.date.recent().toISOString().split('T')[0];
  await page.locator('input[name="tanggalBarangDiterima"]').fill(fakeDate);

  await page.locator('input[name="harga"]').fill(faker.number.int({ min: 1000000, max: 5000000 }).toString());
  await page.locator('input[name="ppn11"]').fill(faker.number.int({ min: 110000, max: 550000 }).toString());
  await page.locator('input[name="ongkirKUT"]').fill(faker.number.int({ min: 50000, max: 200000 }).toString());
  await page.locator('input[name="hargaPPN11Ongkir"]').fill("1.000.000");
  await page.locator('input[name="totalHargaOngkir"]').fill("1.500.000");
  await page.locator('input[name="totalHargaJual"]').fill("2.000.000");
  await page.locator('input[name="hargaProdukReseller"]').fill("2.500.000");
  await page.locator('input[name="ppn11Reseller"]').fill("3.000.000");
  await page.locator('input[name="ongkirReseller"]').fill("3.500.000");
  await page.locator('input[name="hargaPPN11OngkirReseller"]').fill("4.000.000");
  await page.locator('input[name="totalHargaOngkirReseller"]').fill("4.500.000");
  await page.locator('input[name="totalHargaReseller"]').fill("5.000.000");

  // === Status ===
  await page.locator('select[name="statusPesanan"]').selectOption('baru');
  await page.locator('select[name="statusOdoo"]').selectOption('draft');
  
  // === Detail Purchase Order ===
  await page.locator('input[name="tanggalPesananPO"]').fill(fakeDate);
  await page.locator('input[name="nomorPOKUT"]').fill(faker.string.alphanumeric(8).toUpperCase());
  await page.locator('input[name="tanggalBAST"]').fill(fakeDate);
  await page.locator('input[name="nomorBAST"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="nomorInvoiceKUT"]').fill(faker.string.alphanumeric(10).toUpperCase());
  await page.locator('input[name="tanggalInvoiceKUT"]').fill(fakeDate);
  await page.locator('input[name="nomorInvoiceInaproc"]').fill(faker.string.numeric(8));
  await page.locator('input[name="nsfp"]').fill(faker.string.numeric(16));
  await page.locator('input[name="tanggalUangMasuk"]').fill(fakeDate);
  await page.locator('input[name="jumlahUangMasuk"]').fill(faker.number.int({ min: 1000000, max: 10000000 }).toString());
  await page.locator('input[name="rekeningPenerima"]').fill(faker.string.numeric(10));
  await page.locator('select[name="kodeBayar"]').selectOption('UP');
  await page.locator('textarea[name="keterangan"]').fill(faker.lorem.sentence());

  // --- SIMPAN ---
  await page.getByRole('button', { name: /lanjut \/ simpan/i }).click();

  await page.waitForTimeout(5000);
});

