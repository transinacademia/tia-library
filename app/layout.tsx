import '../styles/globals.scss';
import Layout from '../components/Layout'

export const metadata = {
  title: 'Trans in Academia! Library',
  description: 'TIA library migrated to Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
