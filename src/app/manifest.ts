import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'bodyscrub.sk — Prírodné body scrubs',
    short_name: 'bodyscrub.sk',
    description: 'Prírodné body scrubs vyrobené na Slovensku',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#4A6741',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
