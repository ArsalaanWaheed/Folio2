import { isAdmin } from '../../../lib/portfolio-auth';
import { maxUploadBytes, normalizeImage, storeImage } from '../../../lib/portfolio-images';

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Sign in to upload an image.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin &&
    origin !== new URL(request.url).protocol + '//' + request.headers.get('host')) {
    return Response.json({ error: 'Upload must come from the portfolio editor.' }, { status: 403 });
  }

  const tooLarge = () => Response.json({ error: 'Choose an image smaller than 5 MB.' }, { status: 413 });
  if (Number(request.headers.get('content-length')) > maxUploadBytes) return tooLarge();

  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });

  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxUploadBytes) {
        await reader.cancel();
        return tooLarge();
      }
      chunks.push(value);
    }
  } catch {
    return Response.json({ error: 'The upload was interrupted. Try again.' }, { status: 400 });
  }

  let image: Buffer;
  try {
    image = await normalizeImage(Buffer.concat(chunks, size));
  } catch {
    return Response.json({ error: 'Choose a valid JPEG, PNG, WebP, or AVIF image of up to 24 megapixels.' }, { status: 415 });
  }

  try {
    return Response.json({ url: await storeImage(image) });
  } catch (error) {
    console.error('Portfolio image write failed', error);
    return Response.json({ error: 'Could not save the image. Try again.' }, { status: 500 });
  }
}
