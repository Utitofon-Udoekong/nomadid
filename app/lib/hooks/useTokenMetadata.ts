import { useState } from 'react';
import d3ApiService, { TokenMetadata } from '../api/d3Api';

export const useTokenMetadata = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMetadataByTokenId = async (chainId: string, contractAddress: string, tokenId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getTokenMetadataById(chainId, contractAddress, tokenId);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token metadata');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMetadataByName = async (sld: string, tld: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await d3ApiService.getTokenMetadata(sld, tld);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token metadata');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMetadataByTokenId,
    getMetadataByName,
    loading,
    error,
  };
}; 