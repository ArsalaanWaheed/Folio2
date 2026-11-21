import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { readRecord, usesRemoteStorage, writeImageRecord } from './portfolio-remote';

const directory = path.resolve(path.dirname(process.env.PORTFOLIO_DATA_FILE || '.data/portfolio.json'), 'images');
const formats = new Set(['jpeg', 'png', 'webp', 'avif', 'heif']);

export const maxUploadBytes = 5 * 1024 * 1024;
export const validImageName = /^[a-f0-9]{64}\.webp$/;

export async function normalizeImage(input: Uint8Array) {
  const image = sharp(input, { limitInputPixels: 24_000_000, failOn: 'error' });
  const metadata = await image.metadata();
  if (!metadata.format || !formats.has(metadata.format)) throw new Error('Unsupported image format');
  return image.rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 }).toBuffer();
}

export async function storeImage(image: Buffer) {
  const name = createHash('sha256').update(image).digest('hex') + '.webp';
  if (usesRemoteStorage()) {
    await writeImageRecord('image:' + name, image.toString('base64'));
    return '/portfolio-media/' + name;
  }
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, name);
  const temporary = target + '.' + randomUUID() + '.tmp';
  try {
    await writeFile(temporary, image, { flag: 'wx' });
    await rename(temporary, target);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') console.error(error); });
  }
  return '/portfolio-media/' + name;
}

export async function readImage(name: string) {
  if (usesRemoteStorage()) {
    const row = await readRecord('image:' + name);
    if (!row) throw Object.assign(new Error('Image not found.'), { code: 'ENOENT' });
    if (typeof row.value !== 'string') throw new Error('Stored image has an invalid format.');
    return Buffer.from(row.value, 'base64');
  }
  return readFile(path.join(directory, name));
}
