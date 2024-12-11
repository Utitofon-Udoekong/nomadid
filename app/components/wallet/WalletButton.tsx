import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletAuth } from '../../lib/hooks/useWalletAuth';

export default function WalletButton() {
  const { signIn } = useWalletAuth();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return null;
        }

        if (connected) {
          return (
            <div className="flex items-center space-x-4">
              <button
                onClick={openChainModal}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                {chain.hasIcon && (
                  <div className="w-5 h-5">
                    {chain.iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-5 h-5"
                      />
                    )}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {chain.name}
                </span>
              </button>

              <button
                onClick={openAccountModal}
                className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-md"
              >
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {account.displayName}
                </span>
                <span className="text-xs text-indigo-500 dark:text-indigo-400">
                  {account.displayBalance ? `(${account.displayBalance})` : ''}
                </span>
              </button>
            </div>
          );
        }

        return (
          <button
            onClick={() => {
              openConnectModal();
              signIn();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Wallet
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
} 