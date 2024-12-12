import axios from 'axios';

const API_BASE_URL = 'https://api-public.d3.app/v1';
const API_KEY = process.env.NEXT_PUBLIC_D3_API_KEY;

const d3Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': API_KEY,
  },
});

// Request Types
export interface MintNameTokenRequest {
  sld: string;
  tld: string;
  user: {
    wallet: string;
    email: string;
  };
}

export interface SearchParams {
  sld?: string;
  tld?: string;
  limit?: number;
  skip?: number;
}

export interface PartnerOrderRequest {
  paymentOptions: {
    contractAddress: string;
    tokenAddress: string;
    buyerAddress: string;
  };
  names: {
    sld: string;
    tld: string;
    autoRenew: boolean;
    domainLength: number;
  }[];
}

// Response Types
export interface TokenMetadata {
  status: string;
  sld: string;
  tld: string;
  expirationDate: string;
  owner: string;
  tokenId: string;
  contractAddress: string;
  chainId: string;
  txHash: string;
  imageURL: string;
}

export interface SearchResultItem {
  sld: string;
  tld: string;
  status: string;
  isListed: boolean;
  registrationExpiresAt?: string;
  reservationExpiresAt?: string;
  usdPrice: string;
  nativeAmount: string;
  nativeCurrency: string;
  clickUrl: string;
  lockExpiresAt?: string;
}

export interface SearchResponse {
  total: number;
  pageItems: SearchResultItem[];
}

export interface PaymentOption {
  chainId: string;
  chainName: string;
  addressType: string;
  contractAddress: string;
  tokenAddress: string;
  symbol: string;
  icon: string;
  price: number;
}

export interface PaymentOptionsResponse {
  options: PaymentOption[];
}

export interface MintResponse {
  tokenId: string;
  contractAddress: string;
  chainId: string;
}

export const d3ApiService = {
  mintNameToken: async (data: MintNameTokenRequest) => {
    const response = await d3Api.post<MintResponse>('/partner/mint', data);
    console.log('Mint Name Token Response:', response.data);
    return response.data;
  },

  searchTokens: async (params: SearchParams) => {
    const response = await d3Api.get<SearchResponse>('/partner/search', { params });
    console.log('Search Tokens Response:', response.data);
    return response.data;
  },

  getPaymentOptions: async (tld?: string) => {
    const response = await d3Api.get<PaymentOptionsResponse>('/partner/payment/options', {
      params: { tld }
    });
    console.log('Get Payment Options Response:', response.data);
    return response.data;
  },

  createOrder: async (data: PartnerOrderRequest) => {
    const response = await d3Api.post('/partner/order', data);
    console.log('Create Order Response:', response.data);
    return response.data;
  },

  getTokenMetadata: async (sld: string, tld: string) => {
    const response = await d3Api.get<TokenMetadata>(`/partner/token/${sld}/${tld}`);
    console.log('Get Token Metadata Response:', response.data);
    return response.data;
  },

  getTokensByAddress: async (addressType: string, address: string, limit = 25, skip = 0) => {
    const response = await d3Api.get<SearchResponse>(`/partner/tokens/${addressType}/${address}`, {
      params: { limit, skip }
    });
    console.log('Get Tokens By Address Response:', response.data);
    return response.data;
  },

  getRecommendations: async (sld: string, tld?: string) => {
    const response = await d3Api.get<SearchResultItem[]>('/partner/recommendations', {
      params: { sld, tld }
    });
    console.log('Get Recommendations Response:', response.data);
    return response.data;
  },

  getTokenMetadataById: async (chainId: string, contractAddress: string, tokenId: string) => {
    const response = await d3Api.get<TokenMetadata>(
      `/partner/token/${chainId}/${contractAddress}/${tokenId}`
    );
    console.log('Get Token Metadata By ID Response:', response.data);
    return response.data;
  },
};

export default d3ApiService; 