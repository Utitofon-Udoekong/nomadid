import { ReactNode, useState } from 'react';
import { useStore } from '../../lib/store/useStore';
import WalletButton from '../wallet/WalletButton';
import Tabs from '../common/Tabs';
import RegisterName from '../dns/RegisterName';
import NameLookup from '../dns/NameLookup';
import AddressFinder from '../dns/AddressFinder';

const tabs = [
  { id: 'register', label: 'Register Name' },
  { id: 'lookup', label: 'Name Lookup' },
  { id: 'finder', label: 'Address Finder' },
  { id: 'transfer', label: 'Send/Receive' },
];

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('register');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'register':
        return <RegisterName />;
      case 'lookup':
        return <NameLookup />;
      case 'finder':
        return <AddressFinder />;
      case 'transfer':
        return <div>Transfer feature coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  NomadID
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {user?.email && (
                <span className="mr-4 text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
              )}
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="mt-6">
            {renderActiveTab()}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2023 NomadID. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 