export const KATEGORI = {
  IOT_INAPROC: "IoT Inaproc",
  IOT_MANUAL: "IoT Manual",
  TIMBANGAN_INAPROC: "Timbangan Inaproc",
  TIMBANGAN_MANUAL: "Timbangan Manual",
  RCW_360: "RCW-360 PRO HYBRID (GSM+WIFI)",
  RCW_800W: "RCW-800W (LITE)",
} as const;

export const KATEGORI_OPTIONS = Object.values(KATEGORI);

export type KategoriOption = typeof KATEGORI_OPTIONS[number];

