import { useState } from 'react';
import { resolveName, reverseResolve } from '../dns/dnsConnect';

export const useDnsResolver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveNameToAddress = async (name: string, chain: string) => {
    try {
      setLoading(true);
      setError(null);
      const address = await resolveName(name, chain);
      return address;
    } catch (err) {
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
      const name = await reverseResolve(address, chain);
      return name;
    } catch (err) {
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