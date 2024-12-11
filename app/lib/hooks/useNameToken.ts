import { useState } from 'react';
import d3ApiService, { 
  MintNameTokenRequest, 
  TokenMetadata,
  SearchParams,
  TokenSearchResult,
  OrderRequest
} from '../api/d3Api';
import { useStore } from '../store/useStore';

export const useNameToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, addDnsName } = useStore();

  const searchNames = async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.searchTokens(params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search names');
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
      
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint token');
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

  const getUserTokens = async () => {
    if (!user) {
      setError('User not connected');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getTokensByAddress('wallet', user.wallet);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get user tokens');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (sld: string, tld: string, paymentMethod: string, currency: string) => {
    try {
      setLoading(true);
      setError(null);
      const orderRequest: OrderRequest = {
        sld,
        tld,
        paymentMethod,
        currency,
      };
      const response = await d3ApiService.createOrder(orderRequest);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getPaymentOptions();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get payment options');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mintToken,
    getTokenMetadata,
    searchNames,
    getUserTokens,
    createOrder,
    getPaymentOptions,
    loading,
    error,
  };
}; 