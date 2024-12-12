import { useState } from 'react';
import d3ApiService, { 
  MintNameTokenRequest, 
  SearchResultItem,
} from '../api/d3Api';
import { useStore } from '../store/useStore';

export const useNameToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addDnsName } = useStore();

  const checkPrice = async (sld: string, tld: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.searchTokens({
        sld,
        tld,
        limit: 1,
      });
      return response.pageItems[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check price');
      return null;
    } finally {
      setLoading(false);
    }
  };

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
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint token');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (sld: string, tld?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getRecommendations(sld, tld);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkPrice,
    mintToken,
    getRecommendations,
    loading,
    error,
  };
}; 