import { useState } from 'react';
import d3ApiService, { MintNameTokenRequest } from '../api/d3Api';
import { useStore } from '../store/useStore';

export const useNameToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addDnsName } = useStore();

  const mintToken = async (sld: string, tld: string) => {
    if (!user) {
      setError('User not connected');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const mintRequest: MintNameTokenRequest = {
        sld,
        tld,
        user: {
          wallet: user.wallet,
          email: user.email,
        },
      };

      const response = await d3ApiService.mintNameToken(mintRequest);
      const dnsName = `${sld}.${tld}`;
      addDnsName(dnsName);
      
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint token');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTokenPrice = async (sld: string, tld: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getTokenPrice(sld, tld);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token price');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTokenMetadata = async (sld: string, tld: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getTokenMetadata(sld, tld);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token metadata');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mintToken,
    getTokenPrice,
    getTokenMetadata,
    loading,
    error,
  };
}; 