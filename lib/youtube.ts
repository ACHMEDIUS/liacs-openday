const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})(?:[?&].*)?$/i;

export const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/watch?v=bh5V1S0MR_w';

export function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

export function toEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;
}
