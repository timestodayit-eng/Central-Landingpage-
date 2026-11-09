import './globals.css';

export const metadata = {
  title: 'Landing CMS Pro v5 Complete',
  description: 'Flexible JSON landing page CMS'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
