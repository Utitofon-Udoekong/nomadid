import axios from 'axios';

const API_BASE_URL = 'https://api-public.d3.app/v1';

const d3Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MintNameTokenRequest {
  sld: string;
  tld: string;
  user: {
    wallet: string;
    email: string;
  };
}

export interface DomainVerificationRequest {
  domain: string;
}

export const d3ApiService = {
  // Name Token Management
  mintNameToken: async (data: MintNameTokenRequest) => {
    return d3Api.post('/partner/mint', data);
  },

  getTokenMetadata: async (sld: string, tld: string) => {
    return d3Api.get(`/partner/token/${sld}/${tld}`);
  },

  // Domain Verification
  submitDomainVerification: async (data: DomainVerificationRequest) => {
    return d3Api.post('/domain-verification/submit-domain', data);
  },

  checkDomainVerification: async (domain: string) => {
    return d3Api.get(`/domain-verification/status/${domain}`);
  },

  // Token Sales
  getTokenPrice: async (sld: string, tld: string) => {
    return d3Api.get(`/partner/price/${sld}/${tld}`);
  },

  // Add more API endpoints as needed
};

export default d3ApiService; 