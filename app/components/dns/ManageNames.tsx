import { useStore } from '../../lib/store/useStore';
import { useDnsResolver } from '../../lib/hooks/useDnsResolver';

export default function ManageNames() {
  const { user } = useStore();
  const { resolveNameToAddress, loading, error } = useDnsResolver();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Your DNS Names
      </h2>

      {user.dnsNames.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          You haven't registered any DNS names yet.
        </p>
      ) : (
        <div className="space-y-4">
          {user.dnsNames.map((name) => (
            <div
              key={name}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registered to: {user.wallet}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => resolveNameToAddress(name, 'CORE')}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Resolving...' : 'Resolve'}
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Transfer
                  </button>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 