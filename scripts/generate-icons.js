const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createBrandPng(width, height) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const scanlineLen = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLen * height);
  const cx = width / 2;
  const cy = height / 2;

  // Colors:
  // Background: #1b5e20 (Forest Green) -> 27, 94, 32
  // Accent Gold: #fbc02d -> 251, 192, 45
  // White: 255, 255, 255

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLen;
    rawData[offset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 4;
      const dx = (x - cx) / (width / 2);
      const dy = (y - cy) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: Forest Green #1b5e20
      let r = 27, g = 94, b = 32, a = 255;

      // Outer circular badge ring
      if (dist >= 0.78 && dist <= 0.85) {
        // Gold accent ring
        r = 251; g = 192; b = 45;
      } else if (dist < 0.78) {
        // Center graduate cap / career bridge icon motif
        // Top triangle (mortarboard top)
        const inCapTop = (dy >= -0.45 && dy <= -0.1) && (Math.abs(dx) <= (0.45 - Math.abs(dy + 0.25) * 1.5));
        // Bridge base (two pillars and arch)
        const inArch = (dy > 0.05 && dy <= 0.45) && (Math.abs(dx) <= 0.45) && !(dy > 0.2 && Math.abs(dx) < 0.25);

        if (inCapTop || inArch) {
          r = 255; g = 255; b = 255;
        }
      }

      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
      rawData[px + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createBrandPng(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createBrandPng(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), createBrandPng(512, 512));

console.log('Successfully generated PWA icons in assets/icons/');
