import axios from 'axios';

const API_BASE_URL = 'https://api-public.d3.app/v1';

const d3Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface MintNameTokenRequest {
  sld: string;
  tld: string;
  user: {
    wallet: string;
    email: string;
  };
}

export interface TokenMetadata {
  id: string;
  name: string;
  owner: string;
  chainId: number;
  contractAddress: string;
  tokenId: string;
  status: string;
  expiresAt: string;
}

export interface SearchParams {
  query?: string;
  tld?: string;
  limit?: number;
  offset?: number;
}

export interface TokenSearchResult {
  name: string;
  available: boolean;
  price?: string;
  currency?: string;
}

export interface DomainVerificationRequest {
  domain: string;
  proofType: 'DNS' | 'FILE';
}

export interface PaymentOption {
  method: string;
  currency: string;
  minAmount: string;
  maxAmount: string;
}

export interface OrderRequest {
  sld: string;
  tld: string;
  paymentMethod: string;
  currency: string;
}

export const d3ApiService = {
  // Name Token Management
  mintNameToken: async (data: MintNameTokenRequest) => {
    return d3Api.post('/partner/mint', data);
  },

  getTokenMetadata: async (sld: string, tld: string) => {
    return d3Api.get<TokenMetadata>(`/partner/token/${sld}/${tld}`);
  },

  getTokenMetadataById: async (chainId: string, contractAddress: string, tokenId: string) => {
    return d3Api.get<TokenMetadata>(`/partner/token/${chainId}/${contractAddress}/${tokenId}`);
  },

  getTokensByAddress: async (addressType: 'wallet' | 'domain', address: string) => {
    return d3Api.get<TokenMetadata[]>(`/partner/tokens/${addressType}/${address}`);
  },

  // Search and Recommendations
  searchTokens: async (params: SearchParams) => {
    return d3Api.get<TokenSearchResult[]>('/partner/search', { params });
  },

  getRecommendations: async (params: SearchParams) => {
    return d3Api.get<string[]>('/partner/recommendations', { params });
  },

  // Payment and Orders
  getPaymentOptions: async () => {
    return d3Api.get<PaymentOption[]>('/partner/payment/options');
  },

  createOrder: async (data: OrderRequest) => {
    return d3Api.post('/partner/order', data);
  },

  // Domain Verification
  submitDomainVerification: async (data: DomainVerificationRequest) => {
    return d3Api.post('/domain-verification/submit-domain', data);
  },

  getDomainVerificationStatus: async (domain: string) => {
    return d3Api.get('/domain-verification/status', {
      params: { domain },
    });
  },

  // Batch Operations
  getTokenMetadataBatch: async (
    chainId: string,
    contractAddress: string,
    tokenIds: string[]
  ) => {
    return d3Api.post<TokenMetadata[]>(
      `/partner/tokens/${chainId}/${contractAddress}`,
      { tokenIds }
    );
  },
};

export default d3ApiService; 