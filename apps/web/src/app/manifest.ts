import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TheraFlow AI — Practice Operating System',
    short_name: 'TheraFlow AI',
    description: 'AI-Native Digital Operating System for Modern Therapy Practices & Clinics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF8',
    theme_color: '#2D6A4F',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
