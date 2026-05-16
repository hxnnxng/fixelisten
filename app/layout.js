import './globals.css';

export const metadata = { title: 'Fixelisten', description: 'Ting der skal ordnes' };

export default function RootLayout({ children }) {
  return <html lang="da"><body>{children}</body></html>;
}
