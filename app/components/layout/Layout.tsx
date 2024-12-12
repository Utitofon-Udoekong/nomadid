import { ReactNode, useState, useEffect } from 'react';
import { useStore } from '../../lib/store/useStore';
import WalletButton from '../wallet/WalletButton';
import Tabs from '../common/Tabs';
import RegisterName from '../dns/RegisterName';
import NameLookup from '../dns/NameLookup';
import AddressFinder from '../dns/AddressFinder';
import UserGuide from '../guide/UserGuide';
import Tooltip from '../common/Tooltip';

const tabs = [
  { 
    id: 'register', 
    label: 'Register Name',
    tooltip: 'Register your unique DNS names that work across multiple blockchains'
  },
  { 
    id: 'lookup', 
    label: 'Name Lookup',
    tooltip: 'Look up wallet addresses using DNS names'
  },
  { 
    id: 'finder', 
    label: 'Address Finder',
    tooltip: 'Find DNS names associated with wallet addresses'
  },
];

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('register');
  const [showGuide, setShowGuide] = useState(false);

  // Show guide for first-time visitors
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
      localStorage.setItem('hasSeenGuide', 'true');
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'register':
        return <RegisterName />;
      case 'lookup':
        return <NameLookup />;
      case 'finder':
        return <AddressFinder />;
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
          <div className="flex items-center space-x-4">
            <Tabs
              tabs={tabs.map(tab => ({
                ...tab,
                content: (
                  <Tooltip content={tab.tooltip}>
                    <span>{tab.label}</span>
                  </Tooltip>
                )
              }))}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          <div className="mt-6">
            {renderActiveTab()}
          </div>
        </div>
      </main>

      {showGuide && <UserGuide onDismiss={() => setShowGuide(false)} />}
    </div>
  );
} 