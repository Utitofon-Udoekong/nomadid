import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStore } from '../store/useStore';

export const useWalletAuth = () => {
  const { address, isConnected } = useAccount();
  const { setUser, setIsConnected } = useStore();

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        wallet: address,
        email: '',
        dnsNames: [],
      });
      setIsConnected(true);
    } else {
      setUser(null);
      setIsConnected(false);
    }
  }, [isConnected, address, setUser, setIsConnected]);

  return {
    isConnected,
    address,
  };
}; 