import '../styles/globals.scss';
import Layout from '../components/Layout'

export const metadata = {
  title: 'Trans in Academia! Library',
  description: '跨儿学术小组资料库',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
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
