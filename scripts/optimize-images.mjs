import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = './public/Images';
const OUTPUT_DIR = './public/Images/_optimized';
const QUALITY = 85;
const MAX_WIDTH = 1920;

async function optimizeImages() {
  console.log('Optimizando imagenes...\n');

  // Crear carpeta de salida
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(IMAGES_DIR);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  let totalSaved = 0;

  for (const file of imageFiles) {
    const filePath = join(IMAGES_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);
    const originalStats = await stat(filePath);
    const originalSize = originalStats.size;

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      const ext = file.toLowerCase();
      if (ext.endsWith('.png')) {
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
      } else {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
      }

      await pipeline.toFile(outputPath);
      const newStats = await stat(outputPath);
      const newSize = newStats.size;

      const saved = originalSize - newSize;
      totalSaved += saved;

      const originalKB = (originalSize / 1024).toFixed(0);
      const newKB = (newSize / 1024).toFixed(0);
      const savedKB = (saved / 1024).toFixed(0);
      const percent = ((saved / originalSize) * 100).toFixed(1);

      console.log(`[OK] ${file}`);
      console.log(`   ${originalKB}KB -> ${newKB}KB (-${savedKB}KB, -${percent}%)\n`);
    } catch (error) {
      console.log(`[ERROR] ${file} - ${error.message}\n`);
    }
  }

  const totalSavedMB = (totalSaved / 1024 / 1024).toFixed(2);
  console.log(`\nTotal ahorrado: ${totalSavedMB}MB`);
  console.log(`\nImagenes optimizadas en: ${OUTPUT_DIR}`);
  console.log('Copia los archivos de _optimized a Images para aplicar los cambios.');
}

optimizeImages();
