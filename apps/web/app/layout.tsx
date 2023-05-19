import '../global.css'
import dynamic from 'next/dynamic'

dynamic(() => import('preline'))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
