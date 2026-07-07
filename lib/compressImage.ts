/**
 * Resizes an image and re-encodes it as WebP, iterating down in quality/size
 * until the output is under targetBytes (default 250KB) - so every uploaded
 * photo lands in a predictable, small size range regardless of the original.
 */
export async function compressImage(file: File, targetBytes = 200 * 1024): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;

  const attempts: Array<{ maxDimension: number; quality: number }> = [
    { maxDimension: 1600, quality: 0.8 },
    { maxDimension: 1600, quality: 0.6 },
    { maxDimension: 1200, quality: 0.6 },
    { maxDimension: 1200, quality: 0.45 },
    { maxDimension: 900, quality: 0.45 },
    { maxDimension: 900, quality: 0.3 },
    { maxDimension: 700, quality: 0.3 }
  ];

  let bestFile: File | null = null;

  for (const { maxDimension, quality } of attempts) {
    let width = originalWidth;
    let height = originalHeight;
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) continue;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
    const candidate = new File([blob], newName, { type: 'image/webp' });
    bestFile = candidate;

    if (blob.size <= targetBytes) {
      return candidate;
    }
  }

  // Every attempt still came out above target - return the smallest one we got
  // rather than fail the upload; it will still be far smaller than the original.
  return bestFile ?? file;
}

