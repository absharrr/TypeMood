import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageExtension() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const zip = new JSZip();

  const filesToInclude = [
    { name: 'manifest.json', path: path.resolve('public/manifest.json') },
    { name: 'background.js', path: path.resolve('dist/background.js') },
    { name: 'contentScript.js', path: path.resolve('dist/contentScript.js') },
    { name: 'icon16.png', path: path.resolve('public/icon16.png') },
    { name: 'icon48.png', path: path.resolve('public/icon48.png') },
    { name: 'icon128.png', path: path.resolve('public/icon128.png') },
  ];

  for (const file of filesToInclude) {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path);
      zip.file(file.name, content);
    } else {
      console.warn(`Warning: File missing for extension zip: ${file.path}`);
    }
  }

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  const outputPath = path.join(distDir, 'typemood-extension.zip');
  fs.writeFileSync(outputPath, zipContent);

  const publicDir = path.resolve('public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'typemood-extension.zip'), zipContent);
  }

  console.log(`Extension packaged successfully to ${outputPath}`);
}

packageExtension().catch(console.error);
