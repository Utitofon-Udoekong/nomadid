import { useState } from 'react';
import { resolveName, reverseResolve } from '../dns/dnsConnect';
import { useNameToken } from './useNameToken';

export const useDnsResolver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkPrice } = useNameToken();

  const resolveNameToAddress = async (name: string, chain: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Checking if name is registered:', name);
      // First check if the name is available
      const priceCheck = await checkPrice(name.split('.')[0], name.split('.')[1]);
      
      // If the name is available for purchase, it means it's not registered
      if (priceCheck?.status === 'available') {
        console.log('❌ Name is not registered:', name);
        throw new Error('This name has not been registered yet');
      }

      console.log('✅ Name is registered, resolving address');
      const address = await resolveName(name, chain);
      console.log('📍 Resolved address:', address);
      
      return address;
    } catch (err) {
      console.error('❌ Resolution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve name');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resolveAddressToName = async (address: string, chain: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Attempting to reverse resolve address:', address);
      const name = await reverseResolve(address, chain);
      console.log('📍 Resolved name:', name);

      if (!name) {
        console.log('❌ No name found for address');
        throw new Error('No DNS name found for this address');
      }

      return name;
    } catch (err) {
      console.error('❌ Reverse resolution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reverse resolve address');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    resolveNameToAddress,
    resolveAddressToName,
    loading,
    error,
  };
}; 