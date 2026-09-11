import fs from 'fs';
import path from 'path';

// Base64 1x1 green pixel PNG data URI as fallback icon
const greenPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buffer = Buffer.from(greenPngBase64, 'base64');

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon16.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'icon48.png'), buffer);
fs.writeFileSync(path.join(publicDir, 'icon128.png'), buffer);

console.log('Extension icons created successfully!');
