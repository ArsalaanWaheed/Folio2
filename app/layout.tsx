import localFont from 'next/font/local';
import './globals.css';
const sans = localFont({
  src: './fonts/dm-sans.woff2',
  weight: '100 1000',
  variable: '--font-sans',
  display: 'swap',
});
const serif = localFont({
  src: [
    { path: './fonts/cormorant-garamond.woff2', weight: '300 700', style: 'normal' },
    { path: './fonts/cormorant-garamond-italic.woff2', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
});
const urdu = localFont({
  src: './fonts/noto-nastaliq-urdu.ttf',
  weight: '400 700',
  variable: '--font-urdu',
  display: 'swap',
  preload: false,
});
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body className={`${sans.variable} ${serif.variable} ${urdu.variable}`}>{children}</body></html>}
