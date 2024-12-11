import { useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useStore } from '../store/useStore';

export const useWalletAuth = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { setUser, setIsConnected } = useStore();

  // Create SIWE message
  const createSiweMessage = async (address: string, statement: string) => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce: Math.random().toString(36).slice(2),
    });
    return message.prepareMessage();
  };

  // Sign in with Ethereum
  const signIn = async () => {
    try {
      if (!address) return;

      const message = await createSiweMessage(
        address,
        'Sign in to NomadID with your wallet'
      );

      const signature = await signMessageAsync({ message });

      // Here you would typically verify the signature on your backend
      // For now, we'll just set the user in the store
      setUser({
        wallet: address,
        email: '', // You might want to collect this separately
        dnsNames: [],
      });
      setIsConnected(true);
    } catch (error) {
      console.error('Error signing in:', error);
      disconnect();
    }
  };

  // Handle connection changes
  useEffect(() => {
    if (!isConnected) {
      setUser(null);
      setIsConnected(false);
    }
  }, [isConnected, setUser, setIsConnected]);

  return {
    signIn,
    isConnected,
    address,
    disconnect,
  };
}; 