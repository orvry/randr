import { Fraunces, DM_Sans, Caveat } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-hand', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm', display: 'swap' });

export const metadata = {
  title: 'Russelle & Rosie – We’re getting married',
  description: 'Join Russelle & Rosie in the garden on March 21, 2027, Metro Manila, Philippines.',
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
