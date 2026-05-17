import './globals.css';

export const metadata = {
  title: 'Fixelisten',
  description: 'Ting der skal ordnes',
  manifest: '/manifest.json',
  icons: { apple: '/icon-192.png', icon: '/icon-512.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Fixelisten' },
};

export default function RootLayout({ children }) {
  return <html lang="da"><body>{children}</body></html>;
}
