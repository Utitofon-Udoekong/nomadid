'use client';

import { Inter } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import './globals.css';
import { useTheme } from 'next-themes';
import { ThemeProvider } from './providers/ThemeProvider';
import { config } from './lib/config/wagmi';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const client = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
              <RainbowKitProvider modalSize="compact">
                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
