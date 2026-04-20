/**
 * Bunny.net Storage Service
 */

export async function uploadToBunny(file: Buffer, fileName: string) {
  const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE_NAME;
  const API_KEY = process.env.BUNNY_API_KEY;
  const BASE_URL = process.env.BUNNY_BASE_URL || "https://storage.bunnycdn.com";

  if (!STORAGE_ZONE || !API_KEY) {
    throw new Error("Bunny.net credentials not configured in .env");
  }

  // Sanitizar el nombre del archivo para evitar problemas con la URL
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  const finalFileName = `${timestamp}_${sanitizedFileName}`;

  const url = `${BASE_URL}/${STORAGE_ZONE}/${finalFileName}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      AccessKey: API_KEY,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(file),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Bunny Error:", errorText);
    throw new Error(`Failed to upload to Bunny.net: ${response.statusText}`);
  }

  // URL pública sugerida (Pull Zone)
  // Nota: Si el usuario configura un Pull Zone personalizado, se debería usar esa URL.
  // Por defecto Bunny usa {storage-zone}.b-cdn.net
  return `https://${STORAGE_ZONE}.b-cdn.net/${finalFileName}`;
}
