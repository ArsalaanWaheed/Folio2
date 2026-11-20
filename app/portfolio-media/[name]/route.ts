import { readImage, validImageName } from '../../../lib/portfolio-images';

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!validImageName.test(name)) return new Response(null, { status: 404 });

  try {
    const image = await readImage(name);
    return new Response(Uint8Array.from(image), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return new Response(null, { status: 404 });
    throw error;
  }
}
