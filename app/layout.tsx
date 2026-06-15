import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Jordan Real Estate | عقارات الأردن',
  description: 'Your trusted real estate partner in Jordan. Find apartments, lands, and buildings for sale or rent across all governorates.',
  keywords: ['real estate', 'Jordan', 'properties', 'apartments', 'lands', 'buildings', 'buy', 'rent', 'عقارات', 'الأردن'],
  authors: [{ name: 'Jordan Real Estate' }],
  creator: 'Jordan Real Estate',
  publisher: 'Jordan Real Estate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jordan-realestate.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/ar',
      'en': '/en',
    },
  },
  openGraph: {
    title: 'Jordan Real Estate | عقارات الأردن',
    description: 'Your trusted real estate partner in Jordan. Find apartments, lands, and buildings for sale or rent.',
    url: '/',
    siteName: 'Jordan Real Estate',
    locale: 'ar_JO',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jordan Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jordan Real Estate | عقارات الأردن',
    description: 'Your trusted real estate partner in Jordan.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
