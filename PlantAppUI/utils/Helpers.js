export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const isSummerSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  
  const summerStart = new Date(year, 2, 20); // 20 March
  const summerEnd = new Date(year, 11, 21);  // 21 December

  return today >= summerStart && today < summerEnd;
};

export const inferMimeTypeFromUri = (uri) => {
  if (!uri) return null;
  const lower = uri.toLowerCase();
  if (lower.startsWith('data:')) {
    const match = lower.match(/^data:([^;]+);base64,/);
    return match ? match[1] : null;
  }

  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';

  return null;
};

export const buildImageUri = (imageData, mimeType) => {
  if (!imageData) return null;
  const trimmed = imageData.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  const resolvedMime = mimeType || 'image/jpeg';
  return `data:${resolvedMime};base64,${trimmed}`;
};
