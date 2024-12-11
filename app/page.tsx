'use client';

import Layout from './components/layout/Layout';
import RegisterName from './components/dns/RegisterName';
import ManageNames from './components/dns/ManageNames';
import { useStore } from './lib/store/useStore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function Home() {
  const { isConnected } = useStore();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to NomadID
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Your Decentralized Identity on the Web
          </p>
        </div>

        {isConnected ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            <ManageNames />
            <RegisterName />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect your wallet to get started
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose NomadID?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Decentralized Identity
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Own your identity with DNS-based names that you control.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Easy Transactions
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Send and receive crypto using human-readable names.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Self-Sovereign
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your identity, your control. No central authority needed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Marketplace
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Trade and manage your DNS-based name tokens easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
